import { Options } from './types';
import { OptionService } from './option';
import { HttpService } from './http';
import { RequestService } from './request';
import { ResponseService } from './response';
import { RouterService } from './router';
export declare function app(options?: Options): {
    Option: OptionService;
    Router: RouterService;
    Request: RequestService;
    Response: ResponseService;
    HTTP: HttpService;
};
export { app as sheetbase };