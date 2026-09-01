import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { InspectionEvidenceType } from '../../domain/entities/inspection-evidence.entity.js';
import { InspectionOrmEntity } from './inspection.orm-entity.js';

@Entity({ name: 'inspection_evidences' })
export class InspectionEvidenceOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => InspectionOrmEntity, (inspection) => inspection.evidences, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inspection_id' })
  inspection!: InspectionOrmEntity;

  @Column({ type: 'enum', enum: InspectionEvidenceType })
  type!: InspectionEvidenceType;

  @Column({ type: 'varchar' })
  url!: string;

  @Column({ name: 'storage_key', type: 'varchar' })
  storageKey!: string;
}
