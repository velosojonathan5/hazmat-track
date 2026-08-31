import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChecklistStatus } from '../../domain/entities/checklist.entity.js';
import { ChecklistAnswerOrmEntity } from './checklist-answer.orm-entity.js';

@Entity({ name: 'checklists' })
export class ChecklistOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'vehicle_id' })
  vehicleId!: string;

  @Column({ name: 'driver_id' })
  driverId!: string;

  @Column({ name: 'un_number' })
  unNumber!: string;

  @Column({ name: 'inspector_id' })
  inspectorId!: string;

  @Column({ name: 'inspector_name' })
  inspectorName!: string;

  @Column({ type: 'enum', enum: ChecklistStatus })
  status!: ChecklistStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => ChecklistAnswerOrmEntity, (answer) => answer.checklist, { cascade: true })
  answers!: ChecklistAnswerOrmEntity[];
}
