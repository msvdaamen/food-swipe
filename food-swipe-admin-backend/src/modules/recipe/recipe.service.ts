import { DbService } from "../../common/db.service";
import { storageService, type StorageService } from "../../providers/storage/storage.service";

export class RecipeService extends DbService {
    constructor(private readonly storageService: StorageService) {
        super();
    }

}

export const recipeService = new RecipeService(storageService);