import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '5296',
      database: 'matzip-server',
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      synchronize: true, // 운영환경에서 true 로 하면 DB가 날아갈수도 있다. 개발 환경에서만 true로 하자.
    }),
    PostModule,
    AuthModule
  ],
  providers: [],
})
export class AppModule {}
