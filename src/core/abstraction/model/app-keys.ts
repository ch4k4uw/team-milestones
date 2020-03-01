import { IFirebaseConfig } from "./firebase-config";

export interface IAppKeys {
    google: {
        client_id: string;
    };
    facebook: {
        app_id: string;
    };
    owlufin: {
        aws: {
            region: string;
            smtp: {
                server: string;
                port: number;
                useTls: boolean;
                user: string;
                password: string;
                source: string;
            }
        }
    };
    firebase: IFirebaseConfig;
    droidApiKey: string;
    webApiKey: string;
}