import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  UseGuards,
  Get,
  Body,
  Headers,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

// User type from JWT strategy (Account with profile info)
type User = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  isActive: boolean;
};
import { Throttle } from '@nestjs/throttler';
import { ApiBearerAuth, ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @ApiResponse({ status: 200, description: 'User logged in, returns access + refresh tokens in cookies' })
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto, 
    @Res({ passthrough: true }) response: Response,
    @Headers('user-agent') userAgent: string,
    @Req() request: Request
  ) {
    const ipAddress = (request.headers['x-forwarded-for'] as string) || request.ip;
    const result = await this.authService.login(loginDto, userAgent, ipAddress);

    const isProduction = process.env.NODE_ENV === 'production';

    // Layer 1: Access Token
    response.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 2 * 60 * 60 * 1000, // 2h
      path: '/',
    });

    // Layer 2: Refresh Token
    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/',
    });

    // Layer 3: Session Token
    response.cookie('sessionToken', result.sessionToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/',
    });

    return {
      user: result.user,
    };
  }

  @Public()
  @Post('refresh')
  @ApiCookieAuth('refresh-token')
  @ApiResponse({ status: 200, description: 'Refreshes access token using cookie' })
  @Throttle({ default: { limit: 10, ttl: 300000 } }) // 10 requests per 5 minutes
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request, 
    @Res({ passthrough: true }) response: Response,
    @Headers('user-agent') userAgent: string
  ) {
    const refreshToken = request.cookies?.refreshToken;
    const ipAddress = (request.headers['x-forwarded-for'] as string) || request.ip;

    try {
      const result = await this.authService.refreshTokens(refreshToken, userAgent, ipAddress);

      const isProduction = process.env.NODE_ENV === 'production';

      // Update cookies
      response.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 2 * 60 * 60 * 1000,
        path: '/',
      });

      response.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      return {
        user: result.user,
      };
    } catch (error) {
      console.error('Refresh failed:', error.message);
      response.clearCookie('accessToken');
      response.clearCookie('refreshToken');
      response.clearCookie('sessionToken');
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = request.cookies?.refreshToken;
    const sessionToken = request.cookies?.sessionToken;
    
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');
    response.clearCookie('sessionToken');
    
    return this.authService.logout(refreshToken, sessionToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  async logoutAll(@CurrentUser() user: User, @Res({ passthrough: true }) response: Response) {
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');
    response.clearCookie('sessionToken');
    return this.authService.logoutAll(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Returns current user profile' })
  @Throttle({ default: { limit: 60, ttl: 60000 } }) // 60 requests per minute
  async getProfile(@CurrentUser() user: User) {
    return { user };
  }
}
