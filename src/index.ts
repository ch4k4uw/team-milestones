import * as Server from './server';
import * as Configs from "./server/configs";
import * as Hapi from "@hapi/hapi";
import { Context } from "./core/app-context";
import { IContext } from './core/abstraction/app-context';

// Catch unhandling unexpected exceptions
process.on("uncaughtException", (error: Error) => {
    console.error(`uncaughtException ${error.message}`);
});

// Catch unhandling rejected promises
process.on("unhandledRejection", (reason: any) => {
    console.error(`unhandledRejection ${reason}`);
});

export const server: (context?: IContext) => Promise<Hapi.Server> = async (context?: IContext) => {
    if (!context) {
        console.log("Create Context");
        context = await Context.getContext();
        console.log("Context created sucessfully.");
    }
    try {
        return await Server.init(Configs.getServerConfigs(), context);
    } catch (err) {
        console.error("Error starting server: ", err.message);
        throw err;
    }
};

if (!process.env.FIREBASE_CONFIG || !process.env.GCLOUD_PROJECT) {
    server()
        .then(async server => {
            await server.start();
            console.log("Server running at:", server.info.uri);
        })
        .catch(err => {
            throw err;
        });
}