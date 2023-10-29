import { PostgresDatabase } from '@/server/db/root';
export interface HasDB {
  db: PostgresDatabase;
}
