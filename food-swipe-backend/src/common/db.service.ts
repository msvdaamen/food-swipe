import { AsyncLocalStorage } from 'node:async_hooks';
import { databaseProvider, type DatabaseProvider } from '../providers/database.provider';

type TransactionFn = Parameters<DatabaseProvider['transaction']>;
type TransactionCallbackParam = Parameters<TransactionFn[0]>[0];
const dbTransactionStorage = new AsyncLocalStorage<TransactionCallbackParam>();

export class DbService {

  get database(): DatabaseProvider {
    return this.transactionInstance ?? databaseProvider;
  }

  private get transactionInstance(): DatabaseProvider | undefined {
    return dbTransactionStorage.getStore();
  }

  async transaction<T>(callback: (transaction: TransactionCallbackParam) => Promise<T>): Promise<T> {
    return await this.database.transaction(async transaction => {
      return await dbTransactionStorage.run(transaction, async () => {
        return await callback(transaction);
      });
    });
  }
}
