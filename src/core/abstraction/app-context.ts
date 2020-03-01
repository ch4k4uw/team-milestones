import { IAppKeys } from "./model/app-keys";
import { IMilestonesRepository } from "./repository/milestone";
import { ITransaction } from "./db/database";

export interface IRepositories {
    milestones: IMilestonesRepository;
    clearAll(): Promise<void>;
}

export interface IDataAccess {
    repositories: IRepositories;
    runInTransaction<T>(transaction: (t: ITransaction) => Promise<T>): Promise<T>;
}

export interface IContext {
    appKeys: IAppKeys;
    data: IDataAccess;
}