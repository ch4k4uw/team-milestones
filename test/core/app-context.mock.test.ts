import * as Uuid from "uuid";
import { IContext, IDataAccess, IRepositories } from "../../src/core/abstraction/app-context";
import { ITransaction } from "../../src/core/abstraction/db/database";
import { IAppKeys } from "../../src/core/abstraction/model/app-keys";
import { IMilestonesRepository } from "../../src/core/abstraction/repository/milestone";
import { IMilestone } from "../../src/core/abstraction/model/milestone";

const mMilestonesData: IMilestone[] = [];

class MilestonesRepository implements IMilestonesRepository {
    async listAll(transaction?: ITransaction): Promise<IMilestone[]> {
        return mMilestonesData;
    }
    async addAll(milestones: IMilestone[], transaction?: ITransaction): Promise<void> {
        milestones.forEach(v => {
            v.id = Uuid.v1();
            v.createdAt = new Date();
            v.updatedAt = new Date();

            mMilestonesData.push(v);

        });
    }
    async add(milestone: IMilestone, transaction?: ITransaction): Promise<void> {
        milestone.id = Uuid.v1();
        milestone.createdAt = new Date();
        milestone.updatedAt = new Date();
        mMilestonesData.push(milestone);
    }
    async update(milestone: IMilestone, transaction?: ITransaction): Promise<void> {
        const foundMilestone = mMilestonesData.find(v => v.id === milestone.id);
        if (foundMilestone) {
            Object.keys(milestone).forEach( k => {
                if (milestone[k]) {
                    foundMilestone[k] = milestone[k];
                }
            });
        }
    }
    async deleteById(id: string, transaction?: ITransaction): Promise<void> {
        const index = mMilestonesData.findIndex(v => v.id === id);
        if (index >= 0) {
            mMilestonesData.splice(index, 1)
        }
    }
}

class Repositories implements IRepositories {
    milestones: IMilestonesRepository = new MilestonesRepository();
    async clearAll(): Promise<void> {
        mMilestonesData.splice(0, mMilestonesData.length);
    }
}

class DataAccess implements IDataAccess {
    repositories: IRepositories = new Repositories();
    async runInTransaction<T>(transaction: (t: ITransaction) => Promise<T>): Promise<T> {
        return transaction({ transaction: `-transaction-` });
    }
}

export class ContextMock implements IContext {
    appKeys: IAppKeys = {
        firebase: {
            version: 1,
            type: '',
            projectId: '',
            privateKeyId: '',
            privateKey: '',
            clientEmail: '',
            clientId: '',
            authUri: '',
            tokenUri: '',
            authProviderX509CertUrl: '',
            clientX509CertUrl: ''
        }
    };
    data: IDataAccess = new DataAccess();
}