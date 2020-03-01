import * as Hapi from "@hapi/hapi";
import { IPlugin } from "./plugins";
import { IServerConfigurations } from "../core/abstraction/model/server-config";
import * as Milestones from "../api/milestone";
import { IContext } from "../core/abstraction/app-context";

export async function init(configs: IServerConfigurations, context: IContext) : Promise<Hapi.Server> {
    try {
        const port = process.env.PORT || configs.port;
        const server = new Hapi.Server({
			debug: { request: ['error'] },
			port: port,
			routes: {
				cors: {
					origin: ["*"]
				}
			}
        });
        
        if (configs.routePrefix) {
			server.realm.modifiers.route.prefix = configs.routePrefix;
		}

		//	Setup Hapi Plugins
		const plugins: Array<string> = configs.plugins;
		const pluginOptions = {
			serverConfigs: configs
        };

        let pluginPromises: Promise<any>[] = [];
        plugins.forEach((pluginName: string) => {
			var plugin: IPlugin = require("./plugins/" + pluginName).default();
			console.log(
				`Register Plugin ${plugin.info().name} v${plugin.info().version}`
			);
			pluginPromises.push(plugin.register(server, pluginOptions));
        });
        
        await Promise.all(pluginPromises);

        console.log("All plugins registered successfully.");
        console.log("Register Routes");
        Milestones.init(server, context);
        console.log("Routes registered sucessfully.");

        return server;

    } catch (err) {
		console.error("Error starting server: ", err);
		throw err;
	}
}