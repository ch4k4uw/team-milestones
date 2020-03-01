import { IRequest } from "./request";
import { IMilestonePayload } from "./milestone-payload";

export interface IMilestoneRequest extends IRequest {
    payload: IMilestonePayload;
}

export interface IMilestonesRequest extends IRequest {
    payload: IMilestonePayload[];
}