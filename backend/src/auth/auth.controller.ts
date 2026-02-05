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
  @ApiResponse({ status: 200, description: 'User logged in, returns access + refresh tokens' })
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(loginDto);

    // ✅ Set refresh token in httpOnly cookie
    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @Public()
  @Post('refresh')
  @ApiCookieAuth('refresh-token')
  @ApiResponse({ status: 200, description: 'Refreshes access token using cookie' })
  @Throttle({ default: { limit: 10, ttl: 300000 } }) // 10 requests per 5 minutes
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = request.cookies?.refreshToken;

    try {
      const result = await this.authService.refreshTokens(refreshToken);

      // ✅ Update refresh token cookie
      response.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return {
        user: result.user,
        accessToken: result.accessToken,
      };
    } catch (error) {
      // Clear cookie on failure
      console.error('Refresh failed:', error.message);
      response.clearCookie('refreshToken');
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth('access-token') // requires JWT
  @ApiCookieAuth('refresh-token') // clears refresh cookie
  @ApiResponse({ status: 200, description: 'Logs out user and clears refresh token' })
  @HttpCode(HttpStatus.OK)
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = request.cookies?.refreshToken;
    response.clearCookie('refreshToken');
    return this.authService.logout(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token') // requires JWT
  @ApiCookieAuth('refresh-token') // clears refresh cookie
  @ApiResponse({ status: 200, description: 'Logs out user and clears refresh token' })
  async logoutAll(@CurrentUser() user: User, @Res({ passthrough: true }) response: Response) {
    response.clearCookie('refreshToken');
    return this.authService.logoutAll(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Returns current user profile' })
  @Throttle({ default: { limit: 60, ttl: 60000 } }) // 60 requests per minute
  async getProfile(@CurrentUser() user: User) {
    // User from JWT strategy is already safe (no password), just return it
    return { user };
  }
}
