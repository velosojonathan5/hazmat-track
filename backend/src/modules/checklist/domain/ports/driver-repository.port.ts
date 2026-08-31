import type { Driver } from '../entities/driver.entity.js';

export const DRIVER_REPOSITORY_PORT = Symbol('DRIVER_REPOSITORY_PORT');

export interface DriverRepository {
  findByCnh(cnh: string): Promise<Driver | null>;
  findById(id: string): Promise<Driver | null>;
  create(name: string, cnh: string): Promise<Driver>;
}
