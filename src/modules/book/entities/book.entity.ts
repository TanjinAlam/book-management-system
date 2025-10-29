import { CustomBaseEntity } from 'src/common/entity/custom-base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Author } from '../../author/entities/author.entity';

@Entity()
export class Book extends CustomBaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  isbn: string;

  @Column({ type: 'date', nullable: true })
  publishedDate: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  genre: string;

  @ManyToOne(() => Author, (author) => author.books, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'authorId' })
  author: Author;

  @Column({ type: 'int', nullable: false })
  authorId: number;
}
