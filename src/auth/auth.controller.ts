import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { GetUser } from 'src/@common/decorators/get-user.decoretor';
import { User } from './user.entity';


// 엔드포인트를 넣으면 컨트롤러의 모든 경호에 auth 접두사가 추가된다.
@Controller('auth')
//auth 컨트롤러도 서비스를 사용할 수 있게 컨스트럭터로 넣어준다.
// 
export class AuthController {
  constructor(private authService: AuthService) {}

  // HTTP 요청의 경로를 정의한다.
  @Post('/signup')
  // /auth/signin 경로로 POST 요청이 들어왔을 때 호출되는 메서드
  signup(@Body(ValidationPipe) authDto: AuthDto) {
    // 실제로 비즈니스 로직을 처리하는 AuthService의 메서드를 호출한다.
    // signup은 AuthService의 서비스 메서드 이름
    return this.authService.signup(authDto)
  }

  @Post('/signin')
  signin(@Body(ValidationPipe) authDto: AuthDto) {
    return this.authService.signin(authDto)
  }


  @Get('/refresh')
  // 클라이언트 헤더에 토큰이 들어있다.
  // npm i passport passport-jwt @nestjs/passport 인증 전략 라이브러리 설치
  refresh(@GetUser() user: User){
    return this.authService.refreshToken(user)
  }
}
