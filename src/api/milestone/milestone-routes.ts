import * as Hapi from "@hapi/hapi";
import * as Validator from "./milestone-validator";
import MilestoneController from "./milestone-controller";
import { IContext } from "../../core/abstraction/app-context";

export default function (
    server: Hapi.Server,
    context: IContext
) {
    const controller = new MilestoneController(context);
    server.bind(controller);

    server.route([
        {
            method: 'GET',
            path: '/',
            handler: controller.getMilestonesView
        },
        {
            method: 'GET',
            path: '/milestones',
            options: {
                handler: controller.getMilestones,
                tags: ['api', 'milestones'],
                description: 'List all team milestones',
                plugins: {
					"hapi-swagger": {
						responses: {
							"200": {
								description: "Team milestones.",
								schema: Validator.getMilestonesModel
							}
						}
					}
				}
            }
        },
        {
            method: 'POST',
            path: '/milestones',
            options: {
                handler: controller.postMilestones,
                tags: ['api', 'milestones'],
                description: 'Create new team milestones',
                validate: {
                    payload: Validator.postMilestonesModel,
                    failAction: controller.failAction
                },
                plugins: {
					"hapi-swagger": {
						responses: {
							"201": {
								description: "Team milestones.",
								schema: Validator.getMilestonesModel
							}
						}
					}
				}
            }
        },
        {
            method: 'PUT',
            path: '/milestones/{id}',
            options: {
                handler: controller.putMilestone,
                tags: ['api', 'milestones'],
                description: 'Update a team milestone',
                validate: {
                    payload: Validator.putMilestoneModel,
                    params: {
                        id: Validator.updateMilestoneParam
                    },
                    failAction: controller.failAction
                },
                plugins: {
					"hapi-swagger": {
						responses: {
							"200": {
								description: "Team milestone.",
								schema: Validator.getMilestoneModel
							}
						}
					}
				}
            }
        },
        {
            method: 'DELETE',
            path: '/milestones/{id}',
            options: {
                handler: controller.deleteMilestone,
                tags: ['api', 'milestones'],
                description: 'Delete a team milestone',
                validate: {
                    params: {
                        id: Validator.deleteMilestoneParam
                    },
                    failAction: controller.failAction
                },
                plugins: {
					"hapi-swagger": {
						responses: {
							"200": {
								description: "Success."
							}
						}
					}
				}
            }
        }
    ]);

}