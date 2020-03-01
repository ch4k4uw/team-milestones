import * as Hapi from '@hapi/hapi';
import { ICredentials } from './credential-request';

export interface IRequestAuth extends Hapi.RequestAuth {
    credentials: ICredentials;
}