import * as firebase from 'firebase-admin';
import { IMilestonesRepository } from "../abstraction/repository/milestone";
import { IMilestone } from "../abstraction/model/milestone";
import { ITransaction, IDatabase } from '../abstraction/db/database';

export class MilestonesRepository implements IMilestonesRepository {
    constructor(private db: IDatabase) { }

    async listAll(transaction?: ITransaction): Promise<IMilestone[]> {
        return await this.db.queryAllMilestones(transaction);
    }

    async add(milestone: IMilestone, transaction?: ITransaction): Promise<void> {
        await this.db.insertMilestone(milestone, transaction);
    }

    async addAll(milestones: IMilestone[], transaction?: ITransaction): Promise<void> {
        await this.db.insertAllMilestones(milestones, transaction);
    }

    async update(milestone: IMilestone, transaction?: ITransaction): Promise<void> {
        await this.db.updateMilestone(milestone, transaction);
    }

    async deleteById(id: string, transaction?: ITransaction): Promise<void> {
        await this.db.deleteMilestoneById(id, transaction);
    }
}