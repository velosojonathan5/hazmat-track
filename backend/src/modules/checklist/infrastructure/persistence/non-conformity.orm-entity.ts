import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { NonConformitySourceType, NonConformityStatus } from '../../domain/entities/non-conformity.entity.js';

@Entity({ name: 'non_conformities' })
export class NonConformityOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'source_type', type: 'enum', enum: NonConformitySourceType })
  sourceType!: NonConformitySourceType;

  @Column({ name: 'source_id' })
  sourceId!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'enum', enum: NonConformityStatus, default: NonConformityStatus.OPEN })
  status!: NonConformityStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
