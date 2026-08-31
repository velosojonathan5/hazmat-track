import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../domain/entities/user.entity.js';

@Entity({ name: 'users' })
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ name: 'password_hash' })
  passwordHash!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.INSPECTOR })
  role!: UserRole;
}
