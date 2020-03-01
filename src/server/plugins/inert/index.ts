import * as Inert from "@hapi/inert";
import * as Hapi from "@hapi/hapi";
import * as Path from "path";
import { IPlugin } from "..";

const register = async (server: Hapi.Server): Promise<void> => {
	try {
		await server.register([
			Inert
		]);
		server.route([
			{
				method: 'GET',
				path: '/css/{file*}',
				handler: {
					directory: {
						path: 'public/css'
					}
				}
			}
		]);
	} catch (err) {
		console.error(`Error registering Inert plugin: ${err}`);
	}
};

export default (): IPlugin => {
	return {
		register,
		info: () => {
			return { name: "Inert", version: "1.0.0" };
		}
	};
};
