import { CustomBaseEntity } from 'src/common/entity/custom-base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Book } from '../../book/entities/book.entity';

@Entity()
export class Author extends CustomBaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  lastName: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @OneToMany(() => Book, (book) => book.author)
  books: Book[];
}
