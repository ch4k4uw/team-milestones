import * as Hapi from "@hapi/hapi";
import Routes from "./milestone-routes";
import { IContext } from "../../core/abstraction/app-context";

export function init(server: Hapi.Server, context: IContext) {
    Routes(server, context);
}