import { AppService } from './app.service';
interface request {
    action: string;
    x: number;
    y: number;
    facing: string;
}
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getStatus(): Promise<{
        id: number;
        x: number;
        y: number;
        facing: string;
    } | null>;
    handleCommand(body: request): Promise<{
        id: number;
        x: number;
        y: number;
        facing: string;
    } | {
        error: string;
    } | null>;
    getHiroty(): Promise<{
        id: number;
        x: number;
        y: number;
        facing: string;
        createdAt: Date;
    }[]>;
}
export {};
