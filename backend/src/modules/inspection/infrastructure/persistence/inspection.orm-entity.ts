import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { InspectionEvidenceOrmEntity } from './inspection-evidence.orm-entity.js';

@Entity({ name: 'inspections' })
export class InspectionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'vehicle_plate' })
  vehiclePlate!: string;

  @Column({ name: 'un_number' })
  unNumber!: string;

  @Column({ name: 'inspector_id' })
  inspectorId!: string;

  @Column({ name: 'inspector_name' })
  inspectorName!: string;

  @Column({ type: 'double precision' })
  latitude!: number;

  @Column({ type: 'double precision' })
  longitude!: number;

  @Column({ name: 'ringelmann_grade', type: 'smallint', nullable: true })
  ringelmannGrade!: number | null;

  @Column({ type: 'text', nullable: true })
  comments!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => InspectionEvidenceOrmEntity, (evidence) => evidence.inspection, { cascade: true })
  evidences!: InspectionEvidenceOrmEntity[];
}
