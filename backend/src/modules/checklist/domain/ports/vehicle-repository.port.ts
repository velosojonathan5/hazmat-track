import type { Vehicle } from '../entities/vehicle.entity.js';

export const VEHICLE_REPOSITORY_PORT = Symbol('VEHICLE_REPOSITORY_PORT');

export interface VehicleRepository {
  findByPlate(plate: string): Promise<Vehicle | null>;
  findById(id: string): Promise<Vehicle | null>;
  create(plate: string): Promise<Vehicle>;
}
