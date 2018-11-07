import { HttpEvent, RouteRequest, RouteResponse, RouteHandler } from './types';

import { OptionService } from './option';
import { ResponseService } from './response';
import { RouterService } from './router';

export class HttpService {
    private option: OptionService;
    private response: ResponseService;
    private router: RouterService;

    private allowedMethods: string[] = [
        'GET', 'POST', 'PUT', 'PATCH', 'DELETE',
    ];

    constructor (
        option: OptionService,
        response: ResponseService,
        router: RouterService,
    ) {
        this.option = option;
        this.response = response;
        this.router = router;
    }

    get(e: HttpEvent) {
        return this.http(e, 'GET');
    }

    post(e: HttpEvent) {
        return this.http(e, 'POST');
    }

    private http(e: HttpEvent, method: string) {
        let endpoint: string = (e.parameter || {}).e || '';
        if (endpoint.substr(0,1) !== '/') { endpoint = '/' + endpoint; }
        // methods
        const allowMethodsWhenDoGet: boolean = this.option.get('allowMethodsWhenDoGet');
        if (method !== 'GET' || (method === 'GET' && allowMethodsWhenDoGet)) {
            method = ((e.parameter || {}).method as string || 'GET').toUpperCase();
            method = (this.allowedMethods.indexOf(method) > -1) ? method : 'GET';
        }
        // request object
        const req: RouteRequest = {
            query: e.parameter || {},
            body: {},
            data: {},
        };
        if(method === 'GET' && allowMethodsWhenDoGet) {
            try {
                req.body = JSON.parse((e.parameter || {}).body || '{}');
            } catch (error) {
                req.body = {};
            }
        } else {
            req.body = JSON.parse(e.postData ? e.postData.contents : '{}');
        }
        // response object
        const res: RouteResponse = this.response;
        // run handlers
        const handlers: RouteHandler[] = this.router.route(method, endpoint);
        return this.run(handlers, req, res);
    }

    private run(handlers: RouteHandler[], req: RouteRequest, res: RouteResponse) {
        const handler: RouteHandler = handlers.shift();
        if (!handler) {
            throw new Error('Invalid router handler!');
        }
        if (handlers.length < 1) {
            return handler(req, res);
        } else {
            const next = (data: any) => {
                if (data) {
                    if (!(data instanceof Object)) {
                        data = { value: data };
                    }
                    req.data = Object.assign({}, req.data || {}, data || {});
                }
                return this.run(handlers, req, res);
            };
            return handler(req, res, next);
        }
    }
}