import * as Hapi from '@hapi/hapi';
import { IRequestAuth } from './auth-request';

export interface IRequest extends Hapi.Request {
    auth: IRequestAuth;
}