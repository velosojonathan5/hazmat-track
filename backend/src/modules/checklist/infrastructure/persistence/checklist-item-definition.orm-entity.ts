import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ChecklistCategory } from '../../domain/entities/checklist-item-definition.entity.js';

@Entity({ name: 'checklist_items' })
export class ChecklistItemDefinitionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: ChecklistCategory })
  category!: ChecklistCategory;

  @Column({ unique: true })
  code!: string;

  @Column({ type: 'text' })
  description!: string;
}
