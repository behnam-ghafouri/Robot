import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql';

@Injectable()
export class AppService {
  private prisma: PrismaClient;

  constructor() {
    const config = {
      url: 'file:./dev.db',
    };
    const adapter = new PrismaLibSql(config);

    this.prisma = new PrismaClient({ adapter });
  }
  private readonly DIRECTIONS = ['NORTH', 'EAST', 'SOUTH', 'WEST']


  async getRobotState() {
    let current = await this.prisma.robot.findUnique({ where: { id: 1 } });
    if (!current) {
      const pos = { x: 0, y: 0, facing: 'NORTH' };
      const robot = await this.prisma.robot.upsert({
        where: { id: 1 },
        update: pos,
        create: { id: 1, ...pos }
      })
      await this.prisma.history.create({ data: pos });
    }
    current = await this.prisma.robot.findUnique({ where: { id: 1 } });
    return current;
  }

  async place(x: number, y: number, facing: string) {
    console.log("RUN place")
    if (x < 0 || x > 4 || y < 0 || y > 4) {
      return null;
    }

    const pos = { x, y, facing: facing.toUpperCase() };
    const robot = await this.prisma.robot.upsert({
      where: { id: 1 },
      update: pos,
      create: { id: 1, ...pos }
    })
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

  async rotate(side: 'LEFT' | 'RIGHT') {
    const current = await this.getRobotState();
    if (!current) {
      return null;
    }
    var index = this.DIRECTIONS.indexOf(current.facing);
    index = side === 'LEFT' ? (index + 3) % 4 : (index + 1) % 4;
    return await this.place(current.x, current.y, this.DIRECTIONS[index]);
  }

  async getHistory(){
    return await this.prisma.history.findMany({
      take:10,
      skip:1,
      orderBy: {
        id:'desc'
      }
    })
  }

}

