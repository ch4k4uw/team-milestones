import * as Joi from "@hapi/joi";

export const postMilestoneModel = Joi.object().keys({
    year: Joi.number().required().example(2020),
    month: Joi.number().min(1).max(12).required().example(2),
    day: Joi.number().min(1).max(31).example(29),
    date: Joi.date().example('2020-02-29T01:11:08.357Z'),
    description: Joi.string().required().example('Peter built this API release version')
}).label('Milestone post Model');
export const postMilestonesModel = Joi.array().items(
    postMilestoneModel
).label('Milestones post Model');

export const getMilestoneModel = postMilestoneModel.keys({
    id: Joi.string().required().example('CkWFwWygBolqNyWYkeP1')
}).label('Milestone get Model');
export const getMilestonesModel = Joi.array().items(getMilestoneModel).label('Milestones get Model');
export const putMilestoneModel = postMilestoneModel.keys({
    year: Joi.number().not(null).example(2020),
    month: Joi.number().min(1).max(12).not(null).example(2),
    day: Joi.number().min(1).max(31).example(29),
    date: Joi.date().example('2020-02-29T01:11:08.357Z'),
    description: Joi.string().not(null).example('Peter built this API release version')
}).label('Milestone put Model');
export const updateMilestoneParam = Joi.string().required().example('CkWFwWygBolqNyWYkeP1');
export const deleteMilestoneParam = Joi.string().required().example('CkWFwWygBolqNyWYkeP1');