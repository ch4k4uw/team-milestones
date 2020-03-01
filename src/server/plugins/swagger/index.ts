import { IPlugin } from "..";
import * as Inert from "@hapi/inert";
import * as Vision from "@hapi/vision";
import * as Hapi from "@hapi/hapi";
import * as HapiSwagger from "hapi-swagger";
import { IPluginOptions } from "../";
import { IServerConfigurations } from "../../../core/abstraction/model/server-config";

const register = async (server: Hapi.Server, options?: IPluginOptions): Promise<void> => {
	try {
		const config = options ? options.serverConfigs : {} as IServerConfigurations;
		await server.register([
			Inert,
			Vision
		]);
		return server.register([
			{
				plugin: HapiSwagger,
				options: {
					info: {
						title: config.swaggerApiTitle || "Team Milestones",
						description: config.swaggerApiDescription || "Provides ways to register and query Team milestones.",
						version: "1.0"
					},
					tags: [
						{
							name: "milestones",
							description: "Api milestones interface."
						}
					],
					sortTags: 'alpha',
					debug: process.env.NODE_ENV !== 'production',
					swaggerUI: true,
					documentationPage: true,
					documentationPath: "/docs"
				}
			}
		]);
	} catch (err) {
		console.error(`Error registering swagger plugin: ${err}`);
	}
};

export default (): IPlugin => {
	return {
		register,
		info: () => {
			return { name: "Swagger Documentation", version: "1.0.0" };
		}
	};
};
