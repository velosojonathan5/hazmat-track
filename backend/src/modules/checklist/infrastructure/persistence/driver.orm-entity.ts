import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'drivers' })
export class DriverOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  cnh!: string;
}
