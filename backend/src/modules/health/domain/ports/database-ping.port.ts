export const DATABASE_PING_PORT = Symbol('DATABASE_PING_PORT');

export interface DatabasePingPort {
  ping(): Promise<boolean>;
}
