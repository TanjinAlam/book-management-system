import { Column, Entity, OneToMany } from 'typeorm';
import { CustomBaseEntity } from '../../../common/entity/custom-base.entity';
import { Book } from '../../book/entities/book.entity';

@Entity()
export class Author extends CustomBaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  bio: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @OneToMany(() => Book, (book) => book.author, {
    cascade: true, // This enables cascade operations
    onDelete: 'CASCADE', // Database-level cascade delete
  })
  books: Book[];
}
