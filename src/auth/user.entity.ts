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
  // (post) => post.user는 역참조를 설정하는 함수로, Post 엔티티의 user 속성을 참조함
  // eager를 사용하면 관계되어있는 데이터를 함꼐 가져올수 있다.
  @OneToMany(() => Post, (post) => post.user, {eager: false}) 
  post: Post[]
}
