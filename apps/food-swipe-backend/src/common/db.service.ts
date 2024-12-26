import { AsyncLocalStorage } from 'node:async_hooks';
import { databaseProvider, type DatabaseProvider } from '../providers/database.provider';

type TransactionFn = Parameters<DatabaseProvider['transaction']>;
type TransactionCallbackParam = Parameters<TransactionFn[0]>[0];
const dbTransactionStorage = new AsyncLocalStorage<TransactionCallbackParam>();


const _getDatabase = () => {
  return dbTransactionStorage.getStore() ?? databaseProvider;
}

export const getDatabase = (): Omit<DatabaseProvider, 'transaction'> => {
  return _getDatabase();
}

export const transaction = async <T>(callback: (transaction: TransactionCallbackParam) => Promise<T>): Promise<T> => {
  return await _getDatabase().transaction(async transaction => {
    return await dbTransactionStorage.run(transaction, async () => {
      return await callback(transaction);
    });
  });
}

export class DbService {

  get database(): Omit<DatabaseProvider, 'transaction'> {
    return this._getDatabase();
  }

  private _getDatabase() {
    return dbTransactionStorage.getStore() ?? databaseProvider;
  }

  async transaction<T>(callback: (transaction: TransactionCallbackParam) => Promise<T>): Promise<T> {
    return await this._getDatabase().transaction(async transaction => {
      return await dbTransactionStorage.run(transaction, async () => {
        return await callback(transaction);
      });
    });
  }
}