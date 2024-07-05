import { Favorite } from "src/favorite/favorite.entity";
import { MarkerColor } from "src/post/marker-color.enum";
import { Post } from "src/post/post.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

// Entity 데코레이터를 이용해서 class user를 만들어준다.
// 그리고 BaseEntity 라는 것을 Extend로 추가해서 아이디 부터 만든다.
@Entity()
// email 중복은 없어야 하므로 유니크에 email 넣음
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  loginType: 'email' | 'kakao' | 'apple';

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  nickname?: string;

  @Column({ nullable: true })
  imageUri?: string;

  @Column({ nullable: true })
  kakaoImageUri?: string;

  @Column({ nullable: true, default: '' })
  [MarkerColor.RED]: string;

  @Column({ nullable: true, default: '' })
  [MarkerColor.BLUE]: string;

  @Column({ nullable: true, default: '' })
  [MarkerColor.YELLOW]: string;

  @Column({ nullable: true, default: '' })
  [MarkerColor.GREEN]: string;

  @Column({ nullable: true, default: '' })
  [MarkerColor.PURPLE]: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column({ nullable: true })
  hashedRefreshToken?: string;

  // 한명의 유저가 여러개 포스트 => OneToMany
  // () => Post - 대상 엔티티가 Post 임을 나타냄.
  // (post) => post.user는 TypeORM에게 Post 엔티티의 user 속성이 User 엔티티를 참조하고 있음을 알림
  // 이 관계 정의는 데이터베이스에서 외래 키 제약 조건으로 변환된다.
  // Post 테이블은 userId와 같은 외래 키 컬럼을 가지게 되며, 이는 User 테이블의 id 컬럼을 참조한다.
  // 여기에서 post 는 고정 이름이 아니다 anyname이라고 해도 같은 동작을 함
  // eager를 사용하면 관계되어있는 데이터를 함꼐 가져올수 있다.
  @OneToMany(() => Post, (post) => post.user, {eager: false}) 
  post: Post[]

  @OneToMany(() => Favorite, (favorite) => favorite.user, {eager: false}) 
  favorite: Favorite[]
}
