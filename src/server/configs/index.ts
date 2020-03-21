import * as nconf from "nconf";
import * as path from "path";
import { IServerConfigurations } from "../../core/abstraction/model/server-config";
import { Environment } from "../../core/environment";

const NODE_ENV = Environment.getNodeEnv();

//Read Configurations
const configs = new nconf.Provider({
    env: true,
    argv: true,
    store: {
        type: "file",
        file: path.join(__dirname, `./config.${NODE_ENV || "dev"}.json`)
    }
});

export function getServerConfigs(): IServerConfigurations {
    return configs.get("server");
}
	