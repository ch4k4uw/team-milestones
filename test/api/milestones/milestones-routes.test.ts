import * as Hapi from "@hapi/hapi";
import * as Chai from "chai";
import * as Server from "../../../src/server";
import * as Configs from "../../../src/server/configs";
import uuid = require("uuid");
import { IMilestone } from "../../../src/core/abstraction/model/milestone";
import { IContext } from "../../../src/core/abstraction/app-context";
import { ContextMock } from "../../core/app-context.mock.test";
import { IMilestonePayload } from "../../../src/server/abstraction/model/milestone-payload";

const assert = Chai.assert;
const expect = Chai.expect;

describe('Routes tests', () => {
    let server: Hapi.Server;
    let context: IContext;
    before(async () => {
        context = new ContextMock();
        server = await Server.init(Configs.getServerConfigs(), context);

        context.data.repositories.milestones.addAll([
            {
                year: 2020,
                month: 2,
                date: new Date(2020, 1, 1),
                description: 'Team Milestones project Released'
            },
            {
                year: 2020,
                month: 3,
                day: 1,
                date: new Date(2020, 2, 1),
                description: 'Team Milestones project fixed'
            },
            {
                year: 2020,
                month: 3,
                day: 2,
                date: new Date(2020, 2, 2),
                description: 'Some random user read this test case'
            },
            {
                year: 2020,
                month: 3,
                day: 3,
                date: new Date(2020, 2, 2),
                description: 'Our team finish the first flying car of world (great day)'
            },
        ]);
    });

    after(async () => {
        await context.data.repositories.clearAll();
    });

    it('Get all milestones', async () => {
        await context.data.repositories.milestones.addAll([
            {
                year: 2020,
                month: 2,
                date: new Date(2020, 1, 1),
                description: 'We made the first test'
            },
            {
                year: 2020,
                month: 2,
                date: new Date(2020, 1, 1),
                description: 'We made the second test'
            },
            {
                year: 2020,
                month: 2,
                date: new Date(2020, 1, 1),
                description: 'We made the third test'
            },
            {
                year: 2020,
                month: 2,
                date: new Date(2020, 1, 1),
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
        const milestone: IMilestonePayload = {
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
        const milestone: IMilestonePayload = {
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