import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import type { Driver } from '../../domain/entities/driver.entity.js';
import type { DriverRepository } from '../../domain/ports/driver-repository.port.js';
import { DriverOrmEntity } from './driver.orm-entity.js';

@Injectable()
export class TypeOrmDriverRepository implements DriverRepository {
  constructor(
    @InjectRepository(DriverOrmEntity) private readonly repository: Repository<DriverOrmEntity>,
  ) {}

  async findByCnh(cnh: string): Promise<Driver | null> {
    const entity = await this.repository.findOne({ where: { cnh } });
    return entity ? { id: entity.id, name: entity.name, cnh: entity.cnh } : null;
  }

  async findById(id: string): Promise<Driver | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? { id: entity.id, name: entity.name, cnh: entity.cnh } : null;
  }

  async create(name: string, cnh: string): Promise<Driver> {
    const entity = await this.repository.save(this.repository.create({ name, cnh }));
    return { id: entity.id, name: entity.name, cnh: entity.cnh };
  }
}
