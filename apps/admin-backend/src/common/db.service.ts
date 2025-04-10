import { AsyncLocalStorage } from "node:async_hooks";
import {
  databaseProvider,
  type DatabaseProvider,
} from "../providers/database.provider";

type TransactionFn = Parameters<DatabaseProvider["transaction"]>;
type TransactionCallbackParam = Parameters<TransactionFn[0]>[0];
const dbTransactionStorage = new AsyncLocalStorage<TransactionCallbackParam>();

export class DbService {
  get database(): Omit<DatabaseProvider, "transaction"> {
    return this.transactionInstance ?? databaseProvider;
  }

  private get _database(): DatabaseProvider {
    return databaseProvider;
  }

  private get transactionInstance(): DatabaseProvider | undefined {
    return dbTransactionStorage.getStore();
  }

  async transaction<T>(
    callback: (transaction: TransactionCallbackParam) => Promise<T>
  ): Promise<T> {
    return await this._database.transaction(async (transaction) => {
      return await dbTransactionStorage.run(transaction, async () => {
        return await callback(transaction);
      });
    });
  }
}
