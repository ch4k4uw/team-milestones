import * as Server from './server';
import * as Configs from "./server/configs";
import { Context } from "./core/app-context";

// Catch unhandling unexpected exceptions
process.on("uncaughtException", (error: Error) => {
    console.error(`uncaughtException ${error.message}`);
});

// Catch unhandling rejected promises
process.on("unhandledRejection", (reason: any) => {
    console.error(`unhandledRejection ${reason}`);
});

const start = async ({ config }) => {
    try {
        console.log("Create Context");
        const context = await Context.getContext();
        console.log("Context created sucessfully.");

        const server = await Server.init(config, context);
        await server.start();
        console.log("Server running at:", server.info.uri);
    } catch (err) {
        console.error("Error starting server: ", err.message);
        throw err;
    }
};

// Start the server
start({
    config: Configs.getServerConfigs()
});