import { dbPool } from '../config/database';
import { logger } from '../config/logger';

export interface TransactionContext {
  query(sql: string, params?: any[]): Promise<any>;
}

export class TransactionManager {
  /**
   * Run a set of database operations inside a single, managed transaction block.
   * Auto-commits on success, auto-rolls back on error, and always releases the connection.
   */
  static async run<T>(operations: (tx: TransactionContext) => Promise<T>): Promise<T> {
    const connection = await dbPool.getConnection();
    
    try {
      await connection.beginTransaction();
      logger.info('TransactionManager: Transaction started.');
      
      const result = await operations(connection);
      
      await connection.commit();
      logger.info('TransactionManager: Transaction committed successfully.');
      return result;
    } catch (error) {
      logger.error(`TransactionManager: Transaction exception. Rolling back transaction. Error: ${(error as Error).message}`);
      try {
        await connection.rollback();
      } catch (rollbackError) {
        logger.error(`TransactionManager: Failed to roll back transaction. Error: ${(rollbackError as Error).message}`);
      }
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default TransactionManager;
