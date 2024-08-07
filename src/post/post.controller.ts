import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/@common/decorators/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller()
@UseGuards(AuthGuard()) // Post 컨트롤러 전체가 인증이 필요한 곳이기 때문에 상단에 이 코드 작성
export class PostController {
  constructor(private postService: PostService) {}

  @Get('/markers/my')
  getAllMarkers(@GetUser() user:User) {
    return this.postService.getAllMarkers(user)
  }

  @Get('/posts/my')
  getPosts(@Query('page') page: number, @GetUser() user:User) {
    return this.postService.getPosts(page, user);
  }

  @Get('/posts/:id')
  // 파이프를 사용하면 데이터 형식을 원하는 대로 수정할 수 있다.
  // ParseIntPipe는 입력이 string 으로 들어와도 number 타입으로 수정해준다.
  getPostById(@Param('id', ParseIntPipe) id: number, @GetUser() user:User) {
    return this.postService.getPostById(id, user);
  }

  // 클라이언트가 어떤 게시글을 생성할지 데이터가 Body로 들어온다.
  // Body를 이용해서 메서드에도 그 데이터를 넣어줘야 게시글을 생성하는 로직을 작성할 수 있다.
  // Dto는 데이터 전송되는 방법을 정의하는 객체
  @Post('/posts')
  @UsePipes(ValidationPipe)
  createPosts(@Body() createPostDto: CreatePostDto, @GetUser() user:User) {
    return this.postService.createPost(createPostDto, user);
  }

  @Delete('/posts/:id')
  deletePost(@Param('id', ParseIntPipe) id: number, @GetUser() user:User) {
    return this.postService.deletePost(id, user);
  }

  @Patch('/posts/:id')
  // classValidator 를 이용해서 구현한 validation을 적용하려면
  // @UsePipes(ValidationPipe) 이코드를 넣어야한다. 
  @UsePipes(ValidationPipe)
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updatePostDto: Omit<CreatePostDto, 'latitude' | 'logitude' | 'address'>, @GetUser() user:User
  ) {
    return this.postService.updatePost(id, updatePostDto, user);
  }
}
