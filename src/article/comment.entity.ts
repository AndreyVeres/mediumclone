import { UserEntity } from '@app/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ArticleEntity } from './article.entity';

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column()
  body: string;

  @ManyToOne(() => UserEntity, (user) => user.comments, { eager: true, onDelete: 'CASCADE' })
  author: UserEntity;

  @ManyToOne(() => ArticleEntity, (article) => article.comments, { onDelete: 'CASCADE' })
  article: ArticleEntity;
}
