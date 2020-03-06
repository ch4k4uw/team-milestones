import * as firebase from 'firebase-admin';
import * as Fs from 'fs';
import * as Path from 'path';
import { firestore, initializeApp, app } from 'firebase-admin';
import { IDatabase, ITransaction } from "../abstraction/db/database";
import { IFirebaseConfig } from "../abstraction/model/firebase-config";
import { IMilestone } from '../abstraction/model/milestone';

const env = process.env.NODE_ENV !== 'production' ? '-' + (process.env.NODE_ENV || 'dev') : '';
const migrationFilePath = Path.resolve(__dirname, `migrations${env}.json`);
const milestonesDescriptionsPath = Path.resolve(__dirname, 'milestones.json');
function writeMigrationsFile(version: number) {
    if (process.env.NODE_ENV !== 'test') {
        Fs.writeFileSync(migrationFilePath, JSON.stringify({ v: version }));
    }
}

function readMigrationsFile(): number {
    if (Fs.existsSync(migrationFilePath)) {
        const rawBuffer = Fs.readFileSync(migrationFilePath);
        const buffer = JSON.parse(rawBuffer.toString());
        return buffer.v || 0;
    }
    return 0;
}

function readMilestonesDescriptions(): string[] {
    if (Fs.existsSync(milestonesDescriptionsPath)) {
        const rawBuffer = Fs.readFileSync(milestonesDescriptionsPath);
        const buffer = JSON.parse(rawBuffer.toString());
        return (buffer.milestones as any[])
            .map(v => {
                return v.description;
            });
    }
    return [];
}

class FirebaseDatabase implements IDatabase {
    private mDbVersion: number = 0;
    private mFirebaseApp: app.App = null;
    private mMilestonesCollRef: firestore.CollectionReference = null;
    constructor(firebaseConfigs: IFirebaseConfig) {
        this.mDbVersion = firebaseConfigs.version;
        this.mFirebaseApp = initializeApp({
            credential: firebase.credential.cert(firebaseConfigs),
            databaseURL: "https://db1-tt-milestones.firebaseio.com"
        });
        this.mMilestonesCollRef = this.mFirebaseApp.firestore().collection(this.milestonesCollectionName);
    }

    async queryAllMilestones(transaction?: ITransaction): Promise<IMilestone[]> {
        const rawResult = await this.performMilestonesGet(transaction);
        if (rawResult.empty) {
            return [];
        }
        return rawResult.docs.map(doc => {
            return this.parseFields(doc, milestone => milestone.id = doc.id);
        });
    }

    async insertMilestone(milestone: IMilestone, transaction?: ITransaction): Promise<void> {
        const doc = this.mMilestonesCollRef.doc();

        milestone.id = doc.id;
        milestone.createdAt = new Date();
        milestone.updatedAt = milestone.createdAt;

        try {
            await (transaction ? (transaction.transaction as firestore.Transaction).create(doc, milestone) : doc.create(milestone));
        } catch (e) {
            milestone.id = null;
            milestone.createdAt = null;
            milestone.updatedAt = null;
            throw e;
        }
    }

    async insertAllMilestones(milestones: IMilestone[], transaction?: ITransaction): Promise<void> {
        const batch = this.mMilestonesCollRef.firestore.batch();
        milestones.forEach((milestone, i) => {
            const doc = this.mMilestonesCollRef.doc();

            milestone.id = doc.id;
            milestone.createdAt = new Date();
            milestone.createdAt.setMilliseconds(milestone.createdAt.getMilliseconds() + i);
            milestone.updatedAt = milestone.createdAt;

            (((transaction ? transaction.transaction : null) || batch) as any).create(doc, milestone);

        });

        try {
            if (!transaction) {
                await batch.commit();
            }
        } catch (e) {
            milestones.forEach(milestone => {
                milestone.id = null;
                milestone.createdAt = null;
                milestone.updatedAt = null;
            });
            throw e;
        }
    }

    async updateMilestone(milestone: IMilestone, transaction?: ITransaction): Promise<void> {
        if (!milestone.id) {
            throw new Error('Id field must be specified');
        }
        try {
            milestone.updatedAt = new Date();
            if (transaction) {
                (transaction.transaction as firestore.Transaction)
                    .update(this.mMilestonesCollRef.doc(milestone.id), milestone);
            } else {
                await this.mMilestonesCollRef.doc(milestone.id).update(milestone);
            }
        } catch (e) {
            milestone.updatedAt = null;
            throw e;
        }
    }

    async deleteMilestoneById(id: string, transaction?: ITransaction): Promise<void> {
        if (transaction) {
            (transaction.transaction as firestore.Transaction)
                .delete(this.mMilestonesCollRef.doc(id));
        } else {
            await this.mMilestonesCollRef.doc(id).delete();
        }
    }

    async initMilestones(): Promise<void> {
        const db = this
            .mMilestonesCollRef
            .firestore;
        const version = readMigrationsFile();
        for (let i = version; i < this.mDbVersion; ++i) {
            await this.migrate(db, i);
        }
    }

    async clearAllTables() {
        const milestonesDocs = await this.mMilestonesCollRef
            .select('id')
            .get();

        const batch = this.mFirebaseApp.firestore().batch();
        {//Clear milestones
            milestonesDocs.forEach(async doc => {
                batch.delete(this.mMilestonesCollRef.doc(doc.id));
            });
        }

        await batch.commit();

    }

    async runInTransaction<T>(transaction: (t: ITransaction) => Promise<T>): Promise<T> {
        return this.mFirebaseApp.firestore().runTransaction(async t => {
            return await transaction({ transaction: t });
        });
    }

    private get defaultMilestones(): IMilestone[] {
        const descriptions = readMilestonesDescriptions();
        if (descriptions.length > 0) {
            return [
                {
                    year: 2020,
                    month: 1,
                    description: ''
                },
                {
                    year: 2020,
                    month: 1,
                    description: ''
                },
                {
                    year: 2020,
                    month: 1,
                    description: ''
                },
                {
                    year: 2020,
                    month: 1,
                    day: 30,
                    date: new Date(2020, 0, 30, 0, 0, 0, 0),
                    description: ''
                },
                {
                    year: 2020,
                    month: 2,
                    day: 3,
                    date: new Date(2020, 1, 3, 0, 0, 0, 0),
                    description: ''
                },
                {
                    year: 2020,
                    month: 2,
                    day: 3,
                    date: new Date(2020, 1, 3, 0, 0, 0, 1),
                    description: ''
                },
                {
                    year: 2020,
                    month: 2,
                    day: 5,
                    date: new Date(2020, 1, 5, 0, 0, 0, 0),
                    description: ''
                },
                {
                    year: 2020,
                    month: 2,
                    day: 5,
                    date: new Date(2020, 1, 5, 0, 0, 0, 1),
                    description: ''
                },
                {
                    year: 2020,
                    month: 2,
                    day: 5,
                    date: new Date(2020, 1, 5, 0, 0, 0, 2),
                    description: ''
                },
                {
                    year: 2020,
                    month: 2,
                    day: 13,
                    date: new Date(2020, 1, 13, 0, 0, 0, 2),
                    description: ''
                },
                {
                    year: 2020,
                    month: 2,
                    day: 17,
                    date: new Date(2020, 1, 17, 0, 0, 0, 0),
                    description: ''
                },
                {
                    year: 2020,
                    month: 2,
                    day: 17,
                    date: new Date(2020, 1, 17, 0, 0, 0, 1),
                    description: ''
                },
                {
                    year: 2020,
                    month: 2,
                    day: 18,
                    date: new Date(2020, 1, 18, 0, 0, 0, 0),
                    description: ''
                },
                {
                    year: 2020,
                    month: 2,
                    day: 19,
                    date: new Date(2020, 1, 19, 0, 0, 0, 0),
                    description: ''
                },
                {
                    year: 2020,
                    month: 2,
                    day: 21,
                    date: new Date(2020, 1, 21, 0, 0, 0, 0),
                    description: ''
                },
                {
                    year: 2020,
                    month: 2,
                    day: 24,
                    date: new Date(2020, 1, 24, 0, 0, 0, 0),
                    description: ''
                },
                {
                    year: 2020,
                    month: 2,
                    day: 24,
                    date: new Date(2020, 1, 24, 0, 0, 0, 0),
                    description: ''
                },
                {
                    year: 2020,
                    month: 2,
                    day: 26,
                    date: new Date(2020, 1, 26, 0, 0, 0, 0),
                    description: ''
                },
                {
                    year: 2020,
                    month: 2,
                    day: 27,
                    date: new Date(2020, 1, 27, 0, 0, 0, 0),
                    description: ''
                },
                {
                    year: 2020,
                    month: 2,
                    day: 28,
                    date: new Date(2020, 1, 28, 0, 0, 0, 0),
                    description: ''
                },
                {
                    year: 2020,
                    month: 2,
                    day: 28,
                    date: new Date(2020, 1, 28, 0, 0, 0, 1),
                    description: ''
                },
                {
                    year: 2020,
                    month: 3,
                    day: 2,
                    date: new Date(2020, 2, 2, 0, 0, 0, 0),
                    description: ''
                }
            ].map((v, i) => {
                v.description = descriptions[i];
                return v;
            });
        }
        return [];
    }

    private async performMilestonesGet(transaction?: ITransaction): Promise<firestore.QuerySnapshot> {
        return await this.performGet(this.mMilestonesCollRef.orderBy('createdAt'), transaction);
    }

    private async performGet(collRef: firestore.Query, transaction?: ITransaction): Promise<firestore.QuerySnapshot> {
        const fbTransaction = transaction ? transaction.transaction as firestore.Transaction
            :
            null;
        if (fbTransaction) {
            return await fbTransaction.get(collRef);
        }
        return await collRef.get();
    }

    private parseFields<T>(obj: firestore.DocumentData, preParse?: (objData: T) => void): T {
        const result = obj.data() as T;
        if (preParse) {
            preParse(result);
        }
        Object.keys(result).forEach(v => {
            if (result[v] instanceof firestore.Timestamp) {
                result[v] = new Date((result[v] as firestore.Timestamp)
                    .toDate());

                const date = result[v] as Date;
                date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            }
        });
        return result;
    }

    private get milestonesCollectionName(): string {
        return `milestones${env}`;
    }

    private async migrate(db: firestore.Firestore, version: number) {
        if (version === 0) {
            await db.runTransaction(async fbTransaction => {
                await this.insertAllMilestones(this.defaultMilestones, { transaction: fbTransaction });
                writeMigrationsFile(version + 1);
            });

            console.log('Successful prepopulated!!!');

        }
    }
}

export namespace Database {
    export async function getDatabase(firebaseConfigs: IFirebaseConfig): Promise<IDatabase> {
        const result = new FirebaseDatabase(firebaseConfigs);
        await result.initMilestones();

        return result;

    }
}