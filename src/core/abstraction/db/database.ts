import { IMilestone } from "../model/milestone";

export interface ITransaction {
    transaction: any;
}

export interface IDatabase {
    queryAllMilestones(transaction?: ITransaction) : Promise<IMilestone[]>;
    insertMilestone(milestones: IMilestone, transaction?: ITransaction) : Promise<void>;
    insertAllMilestones(milestones: IMilestone[], transaction?: ITransaction) : Promise<void>;
    updateMilestone(milestone: IMilestone, transaction?: ITransaction) : Promise<void>;
    deleteMilestoneById(id: string, transaction?: ITransaction) : Promise<void>;

    initMilestones() : Promise<void>;

    clearAllTables() : Promise<void>;
    runInTransaction<T>(transaction: (t: ITransaction) => Promise<T>) : Promise<T>;
}