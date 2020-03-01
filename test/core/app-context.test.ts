import * as Chai from "chai";
import * as ChaiPromised from "chai-as-promised";
import { Context } from "../../src/core/app-context";
import uuid = require("uuid");
import { IMilestone } from "../../src/core/abstraction/model/milestone";
import { IContext } from "../../src/core/abstraction/app-context";
import { IMilestonesRepository } from "../../src/core/abstraction/repository/milestone";

const assert = Chai.assert;
const expect = Chai.expect;

describe('App Context tests', () => {
    let context: IContext = null;
    let milestonesRepository: IMilestonesRepository = null;
    beforeEach(async () => {
        context = await Context.getContext();
        milestonesRepository = context.data.repositories.milestones;
    });

    afterEach(async () => {
        await context.data.repositories.clearAll();
    });

    it('Init', async () => {
        const milestones = await milestonesRepository.listAll();
        expect(milestones).not.empty;
    });

    it('Add', async () => {
        await milestonesRepository.add({
            year: 2020,
            month: 1,
            description: `Performed Test ${uuid.v4()}`
        });

        const milestones = (await milestonesRepository.listAll()).map(r => r.description);
        expect(milestones.filter(v => v.startsWith('Performed Test')).length).to.not.eq(0);

    });

    it('Update', async () => {
        const milestone: IMilestone = {
            year: 2020,
            month: 1,
            description: `Performed Test ${uuid.v4()}`
        };

        await milestonesRepository.add(milestone);

        milestone.description += ' - Updated';
        await milestonesRepository.update(milestone);

        const milestones = (await milestonesRepository.listAll()).map(r => r.description);
        expect(milestones.filter(v => v.endsWith(' - Updated')).length).to.not.eq(0);

    });

    it('Delete', async () => {
        const mUuid = uuid.v4();
        const milestone: IMilestone = {
            year: 2020,
            month: 1,
            description: `Performed Test ${mUuid}`
        };

        await milestonesRepository.add(milestone);
        await milestonesRepository.deleteById(milestone.id);

        const milestones = (await context
            .data
            .repositories
            .milestones
            .listAll()).map(r => r.description);

        expect(milestones.filter(v => v.indexOf(mUuid) < 0).length).to.eq(0);

    });

});