import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tags' })
export class TagEntity {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public name: string;
}
