import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { GetUser } from 'src/@common/decorators/get-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { EditProfileDto } from './dto/edit-profile.dto';
import { MarkerColor } from 'src/post/marker-color.enum';

// 엔드포인트를 넣으면 컨트롤러의 모든 경호에 auth 접두사가 추가된다.
@Controller('auth')
//auth 컨트롤러도 서비스를 사용할 수 있게 컨스트럭터로 넣어준다.
export class AuthController {
  constructor(private authService: AuthService) {}

  // HTTP 요청의 경로를 정의한다.
  @Post('/signup')
  // /auth/signin 경로로 POST 요청이 들어왔을 때 호출되는 메서드
  signup(@Body(ValidationPipe) authDto: AuthDto) {
    // 실제로 비즈니스 로직을 처리하는 AuthService의 메서드를 호출한다.
    // signup은 AuthService의 서비스 메서드 이름
    return this.authService.signup(authDto);
  }

  @Post('/signin')
  signin(@Body(ValidationPipe) authDto: AuthDto) {
    return this.authService.signin(authDto);
  }

  // 클라이언트 헤더에 토큰이 들어있다.
  // npm i passport passport-jwt @nestjs/passport 인증 전략 라이브러리 설치
  @Get('/refresh')
  // nestjs 의 UserGuards를 이용해서 passport의 AuthGuard를 추가한다.
  // 이렇게하면 내가 작성한 jwt strategy를 사용할 수 있다.
  @UseGuards(AuthGuard())
  refresh(@GetUser() user: User) {
    return this.authService.refreshToken(user);
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  getProfile(@GetUser() user: User) {
    return this.authService.getProfile(user);
  }

  @Patch('/me')
  @UseGuards(AuthGuard())
  editProfile(@Body() editProfileDto: EditProfileDto, @GetUser() user: User) {
    return this.authService.editProfile(editProfileDto, user);
  }

  @Post('/logout')
  @UseGuards(AuthGuard())
  logout(@GetUser() user: User) {
    return this.authService.deleteRefreshToken(user);
  }

  @Delete('/me')
  @UseGuards(AuthGuard())
  deleteAccount(@GetUser() user: User) {
    return this.authService.deleteAccount(user);
  }

  // 마커 색상별 카테고리명 수정
  @Patch('/cateory')
  @UseGuards(AuthGuard())
  updateCategory(
    @GetUser() user: User,
    @Body() categories: Record<keyof MarkerColor, string>
  ) {
    return this.authService.updateCategory(user, categories)
  }
}
