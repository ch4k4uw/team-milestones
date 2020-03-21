import * as Hapi from "@hapi/hapi";
import * as Vision from "@hapi/vision";
import * as Fs from "fs";
import * as Handlebars from 'handlebars';
import * as Path from "path";
import { IPlugin, IPluginOptions } from '..';
import { IServerConfigurations } from '../../../core/abstraction/model/server-config';
import { Environment } from "../../../core/environment";

const NODE_ENV = Environment.getNodeEnv();
const prefix = null; //Fs.existsSync(Path.resolve('build')) ? 'build' : Fs.existsSync(Path.resolve('lib')) ? 'lib' : null;
const viewsPath = prefix ? Path.resolve(prefix, 'public', 'views') : Path.resolve('public', 'views');

const register = async (server: Hapi.Server, options?: IPluginOptions): Promise<void> => {
    try {
        const config = options ? options.serverConfigs : {} as IServerConfigurations;
        await server.register([
            Vision
        ]);
        server.views({
            engines: {
                hbs: Handlebars
            },
            path: viewsPath,
            layoutPath: Path.resolve(viewsPath, 'layouts'),
            layout: 'index',
            isCached: NODE_ENV === 'production',
            context: {
                title: config.layoutTitle || 'Team Milestones'
            }
        });

    } catch (err) {
        console.error(`Error registering Handlebars plugin: ${err}`);
    }
};

export default (): IPlugin => {
    return {
        register,
        info: () => {
            return { name: "Handlebars Documentation", version: "1.0.0" };
        }
    };
};
