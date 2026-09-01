import 'reflect-metadata';
import bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';
import { UserRole } from '../../modules/auth/domain/entities/user.entity.js';
import { UserOrmEntity } from '../../modules/auth/infrastructure/persistence/user.orm-entity.js';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'hazmat',
  password: process.env.DB_PASSWORD ?? 'hazmat',
  database: process.env.DB_NAME ?? 'hazmat_track',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: [UserOrmEntity],
  synchronize: true,
});

const demoUsers = [
  {
    name: 'Demo Inspector',
    email: 'inspector@hazmattrack.demo',
    password: 'inspector123',
    role: UserRole.INSPECTOR,
  },
  {
    name: 'Demo Manager',
    email: 'manager@hazmattrack.demo',
    password: 'manager123',
    role: UserRole.MANAGER,
  },
];

async function run() {
  await dataSource.initialize();
  const repository = dataSource.getRepository(UserOrmEntity);

  for (const demoUser of demoUsers) {
    const existing = await repository.findOne({ where: { email: demoUser.email } });
    if (existing) {
      console.log(`Skipping existing user: ${demoUser.email}`);
      continue;
    }

    const passwordHash = await bcrypt.hash(demoUser.password, 10);
    await repository.save(
      repository.create({
        name: demoUser.name,
        email: demoUser.email,
        passwordHash,
        role: demoUser.role,
      }),
    );
    console.log(`Created user: ${demoUser.email} (${demoUser.role})`);
  }

  await dataSource.destroy();
}

run().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
