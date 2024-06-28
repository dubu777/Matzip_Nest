import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';


// 엔드포인트를 넣으면 컨트롤러의 모든 경호에 auth 접두사가 추가된다.
@Controller('auth')
//auth 컨트롤러도 서비스를 사용할 수 있게 컨스트럭터로 넣어준다.
// 
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signup(@Body() authDto: AuthDto) {

  }
}
