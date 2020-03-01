import { IMilestone } from "../model/milestone";
import { ITransaction } from "../db/database";

export interface IMilestonesRepository {
    listAll(transaction?: ITransaction): Promise<IMilestone[]>;
    addAll(milestones: IMilestone[], transaction?: ITransaction): Promise<void>;
    add(milestone: IMilestone, transaction?: ITransaction): Promise<void>;
    update(milestone: IMilestone, transaction?: ITransaction): Promise<void>;
    deleteById(id: string, transaction?: ITransaction): Promise<void>;
}