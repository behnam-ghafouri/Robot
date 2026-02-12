"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const adapter_libsql_1 = require("@prisma/adapter-libsql");
let AppService = class AppService {
    prisma;
    constructor() {
        const config = {
            url: 'file:./dev.db',
        };
        const adapter = new adapter_libsql_1.PrismaLibSql(config);
        this.prisma = new client_1.PrismaClient({ adapter });
    }
    DIRECTIONS = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
    async getRobotState() {
        return await this.prisma.robot.findUnique({ where: { id: 1 } });
    }
    async place(x, y, facing) {
        console.log("RUN place");
        if (x < 0 || x > 4 || y < 0 || y > 4) {
            return null;
        }
        const pos = { x, y, facing: facing.toUpperCase() };
        const robot = await this.prisma.robot.upsert({
            where: { id: 1 },
            update: pos,
            create: { id: 1, ...pos }
        });
        await this.prisma.history.create({ data: pos });
        return robot;
    }
    async move() {
        const current = await this.getRobotState();
        if (!current) {
            return null;
        }
        var { x, y, facing } = current;
        if (facing === 'NORTH') {
            y++;
        }
        if (facing == 'SOUTH') {
            y--;
        }
        if (facing === 'EAST') {
            x++;
        }
        if (facing === 'WEST') {
            x--;
        }
        const result = await this.place(x, y, facing);
        return result || current;
    }
    async rotate(side) {
        const current = await this.getRobotState();
        if (!current) {
            return null;
        }
        var index = this.DIRECTIONS.indexOf(current.facing);
        index = side === 'LEFT' ? (index + 3) % 4 : (index + 1) % 4;
        return await this.place(current.x, current.y, this.DIRECTIONS[index]);
    }
    async getHistory() {
        return await this.prisma.history.findMany({
            take: 10,
            skip: 1,
            orderBy: {
                id: 'desc'
            }
        });
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AppService);
//# sourceMappingURL=app.service.js.map