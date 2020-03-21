export namespace Environment {
    let FF: any = {
        config: function () { return {}; }
    };
    if (process.env.FIREBASE_CONFIG || process.env.GCLOUD_PROJECT) {
        FF = require("firebase-functions");
    }

    const NODE_ENV = process.env.NODE_ENV || process.env.node_env || (FF.config().global || {}).node_env;
    export function isProduction(): boolean {
        return NODE_ENV === 'production';
    }

    export function isDev(): boolean {
        return !NODE_ENV || NODE_ENV === 'dev';
    }

    export function isTest(): boolean {
        return NODE_ENV === 'test';
    }

    export function getNodeEnv(): string {
        return NODE_ENV;
    }
}