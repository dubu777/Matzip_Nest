import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MarkerColor } from "./marker-color.enum";
import { ColumnNumericTransformer } from "src/@common/transformers/numeric.transformer";
import { User } from "src/auth/user.entity";
import { Image } from "src/image/image.entity";
import { Favorite } from "src/favorite/favorite.entity";


@Entity()
export class Post extends BaseEntity{
  @PrimaryGeneratedColumn() // 기본키 설정
  id: number;

  @Column({
    type: 'decimal',
    transformer: new ColumnNumericTransformer,
  })
  latitude: number;
  
  @Column({
    type: 'decimal',
    transformer: new ColumnNumericTransformer,
  })
  longitude: number;

  @Column()
  color: MarkerColor;

  @Column()
  address: string;

  @Column()
  title: string;
  
  @Column()
  description: string;
  
  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP'
  })
  date: Date;

  @Column()
  score: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  // 여러개의 포스트가 한명의 유저에게 속한다. ManyToOne
  @ManyToOne(() => User, (user) => user.post, {eager: false})
  user:User

  @OneToMany(() => Image, (image) => image.post)
  images: Image[]
  
  @OneToMany(() => Favorite, (favorite) => favorite.post)
  favorites: Favorite[]
}