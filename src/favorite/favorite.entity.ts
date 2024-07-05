import { User } from 'src/auth/user.entity';
import { Post } from 'src/post/post.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Favorite extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  postId: number;

  @Column()
  userId: number;

  // @JoinColumn({ name: 'postId' }): postId 컬럼이 Post 엔티티와의 관계를 나타내는 외래 키임을 명시
  @ManyToOne(() => Post, { onDelete: 'CASCADE'})
  @JoinColumn({name: 'postId'})
  post: Post
  
  @ManyToOne(() => User, { onDelete: 'CASCADE'})
  @JoinColumn({name: 'userId'})
  user: User

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
