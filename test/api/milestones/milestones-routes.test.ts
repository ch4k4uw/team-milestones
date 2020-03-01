import * as Hapi from "@hapi/hapi";
import * as Chai from "chai";
import * as Server from "../../../src/server";
import * as Configs from "../../../src/server/configs";
import * as ChaiPromised from "chai-as-promised";
import { Context } from "../../../src/core/app-context";
import uuid = require("uuid");
import { IMilestone } from "../../../src/core/abstraction/model/milestone";
import { IContext } from "../../../src/core/abstraction/app-context";

const assert = Chai.assert;
const expect = Chai.expect;

describe('Routes tests', () => {
    let server: Hapi.Server;
    let context: IContext;
    before(async () => {
        context = await Context.getContext();
        server = await Server.init(Configs.getServerConfigs(), context);
    });

    after(async () => {
        await context.data.repositories.clearAll();
    });

    it('Get all milestones', async () => {
        await context.data.repositories.milestones.addAll([
            {
                year: 2020,
                month: 2,
                description: 'We made the first test'
            },
            {
                year: 2020,
                month: 2,
                description: 'We made the second test'
            },
            {
                year: 2020,
                month: 2,
                description: 'We made the third test'
            },
            {
                year: 2020,
                month: 2,
                description: 'We Finished the tests'
            }
        ]);

        const options: Hapi.ServerInjectOptions = {
            method: "GET",
            url: "/milestones"
        };

        const requestResult = await server.inject(options);
        assert.equal(requestResult.statusCode, 200);

        const rawResult = JSON.parse(requestResult.payload);
        expect(rawResult).not.empty;

    });

    it('Post a milestone', async () => {
        const milestone: IMilestone = {
            year: 2020,
            month: 1,
            description: `Performed POST Test ${uuid.v4()}`
        }
        const options: Hapi.ServerInjectOptions = {
            method: "POST",
            url: "/milestones",
            payload: [milestone]
        };

        const requestResult = await server.inject(options);
        assert.equal(requestResult.statusCode, 201);

        const rawResult = JSON.parse(requestResult.payload);
        expect(rawResult).not.empty;

    });

    it('Post malformed milestone 1', async () => {
        const milestone: IMilestone = {
            year: 2020,
            month: 1,
            description: `Performed POST Test ${uuid.v4()}`
        }
        const options: Hapi.ServerInjectOptions = {
            method: "POST",
            url: "/milestones",
            payload: milestone
        };

        const requestResult = await server.inject(options);
        assert.equal(requestResult.statusCode, 400);

    });

    it('Post malformed milestone 2', async () => {
        const milestone = {
            year: 2020,
            month: 1
        }
        const options: Hapi.ServerInjectOptions = {
            method: "POST",
            url: "/milestones",
            payload: [milestone]
        };

        const requestResult = await server.inject(options);
        assert.equal(requestResult.statusCode, 400);

    });

    it('Put a milestone', async () => {
        const getRequestResult = await server.inject({
            method: "GET",
            url: "/milestones"
        });
        const rawResult = JSON.parse(getRequestResult.payload) as any[];

        const milestone = {
            description: `${rawResult[rawResult.length - 1].description} - PUT Test`
        };

        const options: Hapi.ServerInjectOptions = {
            method: "PUT",
            url: `/milestones/${rawResult[rawResult.length - 1].id}`,
            payload: milestone
        };

        const requestResult = await server.inject(options);
        assert.equal(requestResult.statusCode, 200);

        const getRequestResult2 = await server.inject({
            method: "GET",
            url: "/milestones"
        });

        const milestonesDescription = (JSON.parse(getRequestResult2.payload) as any[])
            .map(v => v.description as string)
            .filter(v => v.endsWith(' - PUT Test'));

        expect(milestonesDescription).not.empty;

    });

    it('Put malformed milestone', async () => {
        const getRequestResult = await server.inject({
            method: "GET",
            url: "/milestones"
        });
        const rawResult = JSON.parse(getRequestResult.payload) as any[];

        let requestResult = await server.inject({
            method: "PUT",
            url: `/milestones/${rawResult[rawResult.length - 1].id}`,
            payload: {
                description2: `${rawResult[rawResult.length - 1].description} - PUT Test`
            }
        });

        assert.equal(requestResult.statusCode, 400);

        requestResult = await server.inject({
            method: "PUT",
            url: `/milestones/${rawResult[rawResult.length - 1].id}`,
            payload: [{
                description2: `${rawResult[rawResult.length - 1].description} - PUT Test`
            }]
        });

        assert.equal(requestResult.statusCode, 400);

    });

    it('Delete a milestone', async () => {
        const getRequestResult = await server.inject({
            method: "GET",
            url: "/milestones"
        });
        const rawResult = JSON.parse(getRequestResult.payload) as any[];

        let requestResult = await server.inject({
            method: "DELETE",
            url: `/milestones/${rawResult[rawResult.length - 1].id}`
        });

        assert.equal(requestResult.statusCode, 200);


    });
});