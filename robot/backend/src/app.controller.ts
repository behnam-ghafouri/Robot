import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';


interface request {
  action: string,
  x: number,
  y: number,
  facing: string
}

@Controller('robot')
export class AppController {
  constructor(private readonly appService: AppService) { }


  @Get('status')
  getStatus() {
    return this.appService.getRobotState();
  }

  @Post('command')
  async handleCommand(@Body() body: request) {
    console.log("TESTING REQUEST COMES IN: ",body)
    switch (body.action) {
      case 'PLACE':
        if (body.x !== undefined && body.y !== undefined && body.facing !== undefined) {
          return this.appService.place(body.x, body.y, body.facing);
        }
        return { error: 'PLACE ERROR' };
      case 'MOVE': return this.appService.move();
      case 'LEFT': return this.appService.rotate('LEFT');
      case 'RIGHT': return this.appService.rotate('RIGHT');
      case 'REPORT': return this.appService.getRobotState();
      default: return { error: 'Invalid command' };
    }
  }

  @Get('history')
  async getHiroty() {
    return this.appService.getHistory();
  }

}
