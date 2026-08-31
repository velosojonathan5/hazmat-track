import { Controller, Get, HttpCode, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserUseCase } from '../../application/use-cases/get-current-user.use-case.js';
import { LoginUseCase } from '../../application/use-cases/login.use-case.js';
import { UserRole } from '../../domain/entities/user.entity.js';
import { Roles } from './decorators/roles.decorator.js';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto.js';
import { LoginRequestDto } from './dto/login-request.dto.js';
import { LoginResponseDto } from './dto/login-response.dto.js';
import type { AuthenticatedRequest } from './guards/jwt-auth.guard.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
  ) {}

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({ type: LoginResponseDto })
  login(@Body() dto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.loginUseCase.execute(dto.email, dto.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSPECTOR, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOkResponse({ type: AuthenticatedUserDto })
  async me(@Req() request: AuthenticatedRequest): Promise<AuthenticatedUserDto> {
    const user = await this.getCurrentUserUseCase.execute(request.user!.sub);
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
}
