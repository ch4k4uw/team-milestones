import * as nconf from "nconf";
import * as path from "path";
import { IAppKeys } from "./abstraction/model/app-keys";
import { IContext, IRepositories, IDataAccess } from "./abstraction/app-context";
import { Database } from "./db/firebase-database";
import { MilestonesRepository } from "./repository/milestones-repository";
import { IDatabase, ITransaction } from "./abstraction/db/database";

const keyConfigs = new nconf.Provider({
    env: true,
    argv: true,
    store: {
        type: "file",
        file: path.join(__dirname, `../../app-keys.json`)
    }
});

function getAppKeys(): IAppKeys {
    const rawResult = keyConfigs.get();
    const result = rawResult as IAppKeys;

    result.firebase = {
        version: rawResult.firebase.version,
        type: rawResult.firebase.type,
        projectId: rawResult.firebase.project_id,
        privateKeyId: rawResult.firebase.private_key_id,
        privateKey: rawResult.firebase.private_key,
        clientEmail: rawResult.firebase.client_email,
        clientId: rawResult.firebase.client_id,
        authUri: rawResult.firebase.auth_uri,
        tokenUri: rawResult.firebase.token_uri,
        authProviderX509CertUrl: rawResult.firebase.auth_provider_x509_cert_url,
        clientX509CertUrl: rawResult.firebase.client_x509_cert_url
    };

    return result;
}

class Lazy<T> {
    private mValue: T = null;
    constructor(private creator: () => T) { }
    get value(): T {
        if (this.mValue == null) {
            this.mValue = this.creator();
        }
        return this.mValue;
    }
}

class ContextImpl implements IContext {
    private mAppKeys: IAppKeys = null;
    private mDatabase: Lazy<IDatabase> = null;
    private mDataAccess: Lazy<IDataAccess> = null;

    get appKeys(): IAppKeys {
        if (this.mAppKeys == null) {
            this.mAppKeys = getAppKeys();
        }
        return this.mAppKeys;
    }

    get data(): IDataAccess {
        return this.mDataAccess.value;
    }

    constructor(database: IDatabase) {
        this.mDatabase = new Lazy<IDatabase>(() => {
            return database;
        });
        this.mDataAccess = new Lazy<IDataAccess>(() => {
            return {
                repositories: {
                    milestones: new MilestonesRepository(this.mDatabase.value),
                    clearAll: async () => {
                        await this.mDatabase.value.clearAllTables();
                    }
                },
                runInTransaction: async <T>(transaction: (t: ITransaction) => Promise<T>) => {
                    return await this.mDatabase.value.runInTransaction(transaction);
                }
            };
        });
    }
}

export namespace Context {
    let context: ContextImpl = null;
    export async function getContext(): Promise<IContext> {
        if (context == null) {
            const database = await Database
                .getDatabase(getAppKeys().firebase);
            context = new ContextImpl(database);
        }
        return context;
    }
}