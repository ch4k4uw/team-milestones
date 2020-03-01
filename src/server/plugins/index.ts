import * as Hapi from "@hapi/hapi";
import { IServerConfigurations } from "../../core/abstraction/model/server-config";

export interface IPluginOptions {
	serverConfigs: IServerConfigurations;
}

export interface IPlugin {
	register(server: Hapi.Server, options?: IPluginOptions): Promise<void>;
	info(): IPluginInfo;
}

export interface IPluginInfo {
	name: string;
	version: string;
}
