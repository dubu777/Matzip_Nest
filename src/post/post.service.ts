import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/auth/user.entity';
import { Image } from 'src/image/image.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {}

  async getAllMarkers(user: User) {
    try {
      const markers = await this.postRepository
        .createQueryBuilder('post')
        // where절 첫번째인자로 식을 넣고, 두번쨰인자에 변수명에 입력될 값을 넣는다.
        .where('post.userId = :userId', { userId: user.id })
        .select([
          'post.id',
          'post.latitude',
          'post.longitude',
          'post.color',
          'post.score',
        ])
        .getMany();
      return markers;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        '마커를 가져오는 도중 에러가 발생했습니다.',
      );
    }
  }

  // 이미지를 id 기준을 정렬하는 함수
  private getPostWithOrderImages(posts: Post[]) {
    return posts.map((post) => {
      const { images, ...rest } = post;
      const newImages = [...images].sort((a, b) => a.id - b.id);
      return { ...rest, images: newImages };
    });
  }

  async getPosts(page: number, user: User) {
    const perPage = 10;
    const offset = (page - 1) * perPage;

    const posts = await this.postRepository
      .createQueryBuilder('post')
      // leftJoin 두개이상의 테이블을 결합해서 검색할 수 있는 기능
      //post 엔티티의 (post) => post.images) 에서 나옴
      .leftJoin('post.images', 'image')
      .where('post.userId = :userId', { userId: user.id })
      .orderBy('post.date', 'DESC')
      .take(perPage)
      .skip(offset)
      .getMany();

    return this.getPostWithOrderImages(posts);
  }

  async getPostById(id: number, user: User) {
    try {
      const foundPost = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.images', 'image')
        .leftJoinAndSelect(
          'post.favorites',
          'favorite',
          'favorite.userId = :userId',
          { userId: user.id },
        )
        .where('post.userId = :userId', { userId: user.id })
        .andWhere('post.id = :id', { id }) // where 가 이미 있으므로 andWhere
        .getOne();

      if (!foundPost) {
        throw new NotFoundException('존재하지 않는 피드입니다.');
      }

      // favorites의 모든 정보를 보내지 않고 즐겨찾는 게시글인지 여부만 보내기 위해
      // 즐겨찾기를 했다면 favorites의 배열이 0보다 큰것을 이용
      const {favorites, ...rest} = foundPost;
      const postWithIsFavorite = {...rest, isFavorite: favorites.length > 0}

      return postWithIsFavorite;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        '장소를 가져오는 도중 에러가 발생했습니다.',
      );
    }
  }

  async createPost(createPostDto: CreatePostDto, user: User) {
    const {
      latitude,
      longitude,
      color,
      address,
      title,
      date,
      description,
      score,
      imageUris,
    } = createPostDto;

    const post = this.postRepository.create({
      latitude,
      longitude,
      color,
      address,
      title,
      date,
      description,
      score,
      user,
    });
    const images = imageUris.map((uri) => this.imageRepository.create(uri));
    post.images = images;

    try {
      await this.imageRepository.save(images);
      await this.postRepository.save(post);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        '장소를 추가하는 도중 에러가 발생했습니다.',
      );
    }

    // post 객체에서 user 정보를 제외하고 리턴하기 위해서
    const { user: _, ...postWithoutUser } = post;

    return postWithoutUser;
  }

  async deletePost(id: number, user: User) {
    try {
      const result = await this.postRepository
        .createQueryBuilder('post')
        .delete()
        .from(Post)
        // 유저 엔티티와 ManyToOne 관계로 userId 테이블 생성됨
        // from(Post)에서 대상 엔티티를 지정했기 때문에 post.userId처럼 별칭을 사용하면 에러발생.
        .where('userId = :userId', { userId: user.id })
        .andWhere('id = :id', { id })
        .execute();

      if (result.affected === 0) {
        throw new NotFoundException('존재하지 않는 피드입니다.');
      }

      return id;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        '장소를 삭제하는 도중 에러가 발생했습니다.',
      );
    }
  }

  async updatePost(
    id: number,
    updatePostDto: Omit<CreatePostDto, 'latitude' | 'logitude' | 'address'>,
    user: User,
  ) {
    const post = await this.getPostById(id, user);
    const { title, color, date, description, score, imageUris } = updatePostDto;
    post.title = title;
    post.color = color;
    post.date = date;
    post.description = description;
    post.score = score;

    // image module
    const images = imageUris.map((uri) => this.imageRepository.create(uri));
    post.images = images;

    try {
      await this.imageRepository.save(images);
      await this.postRepository.save(post);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        '장소를 수정하는 도중 에러가 발생했습니다.',
      );
    }

    return post;
  }
}
