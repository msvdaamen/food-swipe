import type { DatabaseProvider } from "./providers/database.provider";
import type { AuthProvider } from "./providers/auth.provider";
import type { StorageService } from "./providers/storage/storage.service";

export type AppContext = {
  Bindings: Env;
  Variables: {
    db: DatabaseProvider;
    auth: AuthProvider;
    storage: StorageService;
  };
};
