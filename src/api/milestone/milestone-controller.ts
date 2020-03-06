import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import '../../core/extensions';
import { IContext } from "../../core/abstraction/app-context";
import { IMilestoneRequest, IMilestonesRequest } from "../../server/abstraction/model/milestone-request";
import { IRequest } from '../../server/abstraction/model/request';
import { IMilestone } from '../../core/abstraction/model/milestone';
import { IMilestonesRepository } from '../../core/abstraction/repository/milestone';

export default class MilestoneController {
    private mRepository: IMilestonesRepository = null;
    constructor(private context: IContext) {
        this.mRepository = this.context.data.repositories.milestones;
    }

    async getMilestonesView(_request: IRequest, h: Hapi.ResponseToolkit): Promise<Hapi.ResponseObject | Boom> {
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

        try {
            const milestones = await this.mRepository.listAll();
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
            milestones.sort((milestone1, milestone2) => {
                const m1 = `${milestone1.year}-${padLeft(milestone1.month)}-${padLeft(milestone1.day)}##'${milestone1.description}#`;
                const m2 = `${milestone2.year}-${padLeft(milestone2.month)}-${padLeft(milestone2.day)}##'${milestone2.description}#`;

                return m1 > m2 ? 1 : -1;
            }).forEach(milestone => {
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

            return h.view('timeline', {
                years: dto
            });
        } catch (e) {
            return Boom.badImplementation(e.message || e);
        }
    }

    async getMilestones(_request: IRequest, h: Hapi.ResponseToolkit): Promise<Hapi.ResponseObject> {
        const result = await this.mRepository.listAll();
        return h.response(result).code(200);
    }

    async postMilestones(request: IMilestonesRequest, h: Hapi.ResponseToolkit): Promise<Hapi.ResponseObject | Boom> {
        try {
            await this.mRepository.addAll(request.payload);
            return h.response(request.payload).code(201);
        } catch (e) {
            return Boom.badImplementation(e.message || e);
        }
    }

    async putMilestone(request: IMilestoneRequest, h: Hapi.ResponseToolkit): Promise<Hapi.ResponseObject | Boom> {
        try {
            const id = request.params.id;
            const milestone = request.payload as IMilestone;
            milestone.id = id;

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
}