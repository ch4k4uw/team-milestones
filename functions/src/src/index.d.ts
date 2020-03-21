import * as Hapi from "@hapi/hapi";

declare module Main {
    function server(): Promise<Hapi.Server>;
}

export = Main;