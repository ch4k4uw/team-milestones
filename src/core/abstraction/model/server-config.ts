export interface IServerConfigurations {
    port: number;
    plugins: Array<string>;
    layoutTitle?: string;
    swaggerApiTitle?: string;
    swaggerApiDescription?: string;
    jwtSecret: string;
    jwtAndroidSecret: string;
    jwtExpiration: string;
    routePrefix: string;
}