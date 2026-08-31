import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import type { Vehicle } from '../../domain/entities/vehicle.entity.js';
import type { VehicleRepository } from '../../domain/ports/vehicle-repository.port.js';
import { VehicleOrmEntity } from './vehicle.orm-entity.js';

@Injectable()
export class TypeOrmVehicleRepository implements VehicleRepository {
  constructor(
    @InjectRepository(VehicleOrmEntity) private readonly repository: Repository<VehicleOrmEntity>,
  ) {}

  async findByPlate(plate: string): Promise<Vehicle | null> {
    const entity = await this.repository.findOne({ where: { plate } });
    return entity ? { id: entity.id, plate: entity.plate } : null;
  }

  async findById(id: string): Promise<Vehicle | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? { id: entity.id, plate: entity.plate } : null;
  }

  async create(plate: string): Promise<Vehicle> {
    const entity = await this.repository.save(this.repository.create({ plate }));
    return { id: entity.id, plate: entity.plate };
  }
}
