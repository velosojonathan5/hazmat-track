import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AnswerValue } from '../../domain/entities/checklist-answer.entity.js';
import { ChecklistItemDefinitionOrmEntity } from './checklist-item-definition.orm-entity.js';
import { ChecklistOrmEntity } from './checklist.orm-entity.js';

@Entity({ name: 'checklist_answers' })
export class ChecklistAnswerOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => ChecklistOrmEntity, (checklist) => checklist.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'checklist_id' })
  checklist!: ChecklistOrmEntity;

  @ManyToOne(() => ChecklistItemDefinitionOrmEntity)
  @JoinColumn({ name: 'item_definition_id' })
  itemDefinition!: ChecklistItemDefinitionOrmEntity;

  @Column({ type: 'enum', enum: AnswerValue })
  answer!: AnswerValue;

  @Column({ type: 'text', nullable: true })
  note!: string | null;

  @Column({ name: 'photo_url', type: 'varchar', nullable: true })
  photoUrl!: string | null;
}
