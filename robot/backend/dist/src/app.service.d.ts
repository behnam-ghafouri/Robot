export declare class AppService {
    private prisma;
    constructor();
    private readonly DIRECTIONS;
    getRobotState(): Promise<{
        id: number;
        x: number;
        y: number;
        facing: string;
    } | null>;
    place(x: number, y: number, facing: string): Promise<{
        id: number;
        x: number;
        y: number;
        facing: string;
    } | null>;
    move(): Promise<{
        id: number;
        x: number;
        y: number;
        facing: string;
    } | null>;
    rotate(side: 'LEFT' | 'RIGHT'): Promise<{
        id: number;
        x: number;
        y: number;
        facing: string;
    } | null>;
    getHistory(): Promise<{
        id: number;
        x: number;
        y: number;
        facing: string;
        createdAt: Date;
    }[]>;
}
