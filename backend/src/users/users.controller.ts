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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
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
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 201, description: 'User created successfully' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('import')
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 201, description: 'Users imported successfully' })
  async import(@UploadedFile() file: Express.Multer.File) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet) as any[];

    console.log('[Import] Raw data from XLSX:', data);

    // Map the excel data to our expected format with fuzzy header matching
    const users = data.map((row) => {
      // Find keys in the row object regardless of case or spaces
      const findValue = (possibleNames: string[]) => {
        const key = Object.keys(row).find(k => 
          possibleNames.some(name => k.toLowerCase().trim() === name.toLowerCase())
        );
        return key ? row[key] : undefined;
      };

      return {
        email: findValue(['email', 'email address', 'e-mail']),
        firstName: findValue(['first name', 'firstname', 'given name']),
        lastName: findValue(['last name', 'lastname', 'surname', 'family name']),
        role: findValue(['role', 'type', 'position']) || 'SCHOOL_PERSONNEL',
        password: findValue(['password', 'pass', 'pw']),
      };
    });

    console.log('[Import] Mapped users:', users);

    // Filter out rows that have no email
    const validUsers = users.filter(u => u.email);
    console.log('[Import] Valid users count:', validUsers.length);

    const result = await this.usersService.importUsers(validUsers);
    console.log('[Import] Result:', result);
    return result;
  }

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
