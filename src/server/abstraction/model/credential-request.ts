import * as Hapi from '@hapi/hapi';

export interface ICredentials extends Hapi.AuthCredentials {
    id: string;
}