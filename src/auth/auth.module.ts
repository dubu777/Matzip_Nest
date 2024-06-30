import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({}),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  // 다른 모듈에서 재사용하려면 exports 를 사용하여 내보내야한다.
  // 이렇게 하면 다른 모듈에서 AuthModule을 임포트하면 이 서비스를 주입받아 사용할 수 있다.
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
