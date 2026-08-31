import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, type JwtModuleOptions, type JwtSignOptions } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetCurrentUserUseCase } from './application/use-cases/get-current-user.use-case.js';
import { LoginUseCase } from './application/use-cases/login.use-case.js';
import { PASSWORD_HASHER_PORT } from './domain/ports/password-hasher.port.js';
import { TOKEN_ISSUER_PORT } from './domain/ports/token-issuer.port.js';
import { USER_REPOSITORY_PORT } from './domain/ports/user-repository.port.js';
import { AuthController } from './infrastructure/http/auth.controller.js';
import { JwtAuthGuard } from './infrastructure/http/guards/jwt-auth.guard.js';
import { RolesGuard } from './infrastructure/http/guards/roles.guard.js';
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm-user-repository.adapter.js';
import { UserOrmEntity } from './infrastructure/persistence/user.orm-entity.js';
import { BcryptPasswordHasher } from './infrastructure/security/bcrypt-password-hasher.adapter.js';
import { JwtTokenIssuer } from './infrastructure/security/jwt-token-issuer.adapter.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN') as JwtSignOptions['expiresIn'],
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    GetCurrentUserUseCase,
    { provide: USER_REPOSITORY_PORT, useClass: TypeOrmUserRepository },
    { provide: PASSWORD_HASHER_PORT, useClass: BcryptPasswordHasher },
    { provide: TOKEN_ISSUER_PORT, useClass: JwtTokenIssuer },
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
