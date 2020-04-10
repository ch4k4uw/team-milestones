import * as Boom from '@hapi/boom';
import * as Hapi from '@hapi/hapi';
import { IContext } from "../../core/abstraction/app-context";
import { IMilestone } from '../../core/abstraction/model/milestone';
import { IMilestonesRepository } from '../../core/abstraction/repository/milestone';
import '../../core/extensions';
import { IMilestonePayload } from '../../server/abstraction/model/milestone-payload';
import { IMilestoneRequest, IMilestonesRequest } from "../../server/abstraction/model/milestone-request";
import { IRequest } from '../../server/abstraction/model/request';

export default class MilestoneController {
    private mRepository: IMilestonesRepository = null;
    constructor(private context: IContext) {
        this.mRepository = this.context.data.repositories.milestones;
    }

    async getMilestonesView(_request: IRequest, h: Hapi.ResponseToolkit): Promise<Hapi.ResponseObject | Boom> {
        try {
            return h.view('timeline', {
                years: this.toViewDto(await this.mRepository.listAll())
            });
        } catch (e) {
            return Boom.badImplementation(e.message || e);
        }
    }

    async getMilestones(_request: IRequest, h: Hapi.ResponseToolkit): Promise<Hapi.ResponseObject> {
        const result = this.sortMilestones(await this.mRepository.listAll());
        return h.response(result).code(200);
    }

    async postMilestones(request: IMilestonesRequest, h: Hapi.ResponseToolkit): Promise<Hapi.ResponseObject | Boom> {
        try {
            await this.mRepository.addAll(this.preparePost(request.payload));
            return h.response(request.payload).code(201);
        } catch (e) {
            return Boom.badImplementation(e.message || e);
        }
    }

    async putMilestone(request: IMilestoneRequest, h: Hapi.ResponseToolkit): Promise<Hapi.ResponseObject | Boom> {
        try {
            const milestone = this.preparePut(request.payload, request.params.id);
            await this.mRepository.update(milestone);
            return h.response(milestone).code(200);
        } catch (e) {
            return Boom.badImplementation(e.message || e);
        }
    }

    async deleteMilestone(request: IRequest, h: Hapi.ResponseToolkit): Promise<Hapi.ResponseObject | Boom> {
        try {
            await this.mRepository.deleteById(request.params.id);
            return h.response().code(200);
        } catch (e) {
            return Boom.badImplementation(e.message || e);
        }
    }

    async failAction(_request: IRequest, _h: Hapi.ResponseToolkit, err?: Error) {
        //console.error(err);
        throw err;
    }

    private preparePost(payload: IMilestonePayload[]): IMilestone[] {
        return payload.map(d => {
            return {
                year: d.year,
                month: d.month,
                day: d.day,
                date: new Date(d.year, d.month, d.day || 1, 0, 0, 0, 0),
                description: d.description
            };
        });
    }

    private preparePut(payload: IMilestonePayload, id): IMilestone {
        return {
            id: id,
            year: payload.year,
            month: payload.month,
            day: payload.day,
            date: new Date(payload.year, payload.month, payload.day || 1, 0, 0, 0, 0),
            description: payload.description
        };
    }

    private sortMilestones(milestones: IMilestone[]): IMilestone[] {
        return milestones.sort((firstMilestone, secondMilestone) => {
            let result = firstMilestone.date.getTime() - secondMilestone.date.getTime();
            if (result === 0) {
                return firstMilestone.description.localeCompare(secondMilestone.description);
            }
            return result;
        });
    }

    private toViewDto(milestones: IMilestone[]): any {
        const dto: [
            {
                year: number,
                milestones: [
                    {
                        day: string,
                        month: string,
                        description: string
                    }?
                ]
            }?
        ] = [];

        const padLeft = (n?: number) => {
            return `${n && n < 10 ? '0' : ''}${n || '-'}`;
        };
        let lastYear: number = 0;
        let currDto: [
            {
                day: string,
                month: string,
                description: string
            }?
        ];
        this.sortMilestones(milestones).forEach(milestone => {
            if (milestone.year !== lastYear) {
                lastYear = milestone.year;
                currDto = [];
                dto.push({ year: milestone.year, milestones: currDto });
            }
            currDto.push({
                day: padLeft(milestone.day),
                month: (milestone.month - 1).toShortMonthName(),
                description: milestone.description
            });
        });
        return dto;
    }
}