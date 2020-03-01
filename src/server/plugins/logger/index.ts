import { IPlugin } from "../";
import * as Hapi from "@hapi/hapi";
import * as Good from "@hapi/good";

const register = async (server: Hapi.Server): Promise<void> => {
	try {
		return server.register({
			plugin: Good,
			options: {
				ops: {
					interval: 1000
				},
				reporters: {
					consoleReporter: [
						{
							module: "@hapi/good-squeeze",
							name: "Squeeze",
							args: [
								{
									error: "*",
									log: "*",
									response: "*",
									request: "*"
								}
							]
						},
						{
							module: "@hapi/good-console"
						},
						"stdout"
					]
				}
			}
		});
	} catch (err) {
		console.log(`Error registering logger plugin: ${err}`);
		throw err;
	}
};

export default (): IPlugin => {
	return {
		register,
		info: () => {
			return { name: "Good Logger", version: "1.0.0" };
		}
	};
};
