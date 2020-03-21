import * as functions from 'firebase-functions';
import { server } from "./src";
import * as Hapi from "@hapi/hapi";

var appServer: Hapi.Server;
async function initServer() {
    if (!appServer) {
        try {
            appServer = await server();
            await appServer.initialize();
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

function responseHapiResponse(result: Hapi.ServerInjectResponse, response: functions.Response<any>) {
    if (result.headers) {
        Object.keys(result.headers).forEach(k => {
            response.setHeader(k, result.headers[k]);
        });
    }

    if (result.rawPayload && result.rawPayload instanceof Buffer) {
        const rawPayload: Buffer = result.rawPayload;
        if (rawPayload.length > 0) {
            response.write(result.rawPayload, () => {
                response.end();
            });
        } else {
            console.log('Empty buffer!!!');
            response
                .status(result.statusCode)
                .send(result.result);
        }
    } else {
        console.log('Other!!!');
        response
            .status(result.statusCode)
            .send(result.result);
    }
}

export const v1 = functions.https.onRequest(async (request: functions.https.Request, response: functions.Response<any>) => {
    await initServer();
    if (request.url === '/' || request.url === '/index.html') {
        if (request.url === '/') {
            response.redirect('./v1/index.html');
        } else {
            const options: Hapi.ServerInjectOptions = {
                method: 'GET',
                url: '/',
                payload: request.body,
                headers: request.headers as any
            };
    
            responseHapiResponse(await appServer.inject(options), response);

        }
    } else {
        const options: Hapi.ServerInjectOptions = {
            method: request.method,
            url: request.url,
            payload: request.body,
            headers: request.headers as any
        };

        responseHapiResponse(await appServer.inject(options), response);
        
    }

});

//start();