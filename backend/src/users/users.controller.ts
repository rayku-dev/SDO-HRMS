import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { SafeUser } from '@/lib/utils/user.mapper';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { ApiBearerAuth, ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN, Role.HR_HEAD, Role.HR_ASSOCIATE)
  @ApiBearerAuth('access-token')
  @ApiCookieAuth('refresh-token')
  @ApiResponse({ status: 200, description: 'List of all accounts' })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  getProfile(@CurrentUser() user: SafeUser) {
    return this.usersService.findOne(user.id);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.HR_HEAD, Role.HR_ASSOCIATE)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('profile')
  updateProfile(@CurrentUser() user: SafeUser, @Body() updateUserDto: UpdateUserDto) {
    // Users can only update their own profile (excluding role changes)
    const { role, ...allowedUpdates } = updateUserDto;
    return this.usersService.update(user.id, allowedUpdates);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.HR_HEAD, Role.HR_ASSOCIATE)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.HR_HEAD, Role.HR_ASSOCIATE)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('change-password')
  changePassword(@CurrentUser() user: SafeUser, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(user.id, changePasswordDto);
  }

  @Get('sessions/active')
  getSessions(@CurrentUser() user: SafeUser) {
    return this.usersService.getUserSessions(user.id);
  }
}
