import { Options } from './types';

import { OptionService } from './option';
import { HttpService } from './http';
import { RequestService } from './request';
import { ResponseService } from './response';
import { RouterService } from './router';

export function sheetbase(options?: Options) {
    const Option = new OptionService(options);
    const Router = new RouterService();
    const Request = new RequestService();
    const Response = new ResponseService(Option);
    const HTTP = new HttpService(Option, Response, Router);
    return {
        Option,
        Router,
        Request,
        Response,
        HTTP,

        set: Option.set,

        use: Router.use,
        all: Router.all,
        get: Router.get,
        post: Router.post,
        put: Router.put,
        patch: Router.patch,
        delete: Router.delete,
    };
}

export { sheetbase as app };