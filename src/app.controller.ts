import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/file')
  getFile(@Res() res: Response) {
    fs.readFile('temp.txt', 'utf8', (err, data) => {
      if (err) {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: 'Error retrieving temp.txt' });
      } else {
        res.status(HttpStatus.OK).json({ text: data || '' });
      }
    });
  }

  @Post('/file')
  appendFile(@Body() body: { text: string }, @Res() res: Response) {
    const { text } = body;
    fs.writeFile('temp.txt', text, (err) => {
      if (err) {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: 'Error saving file' });
      } else {
        res
          .status(HttpStatus.CREATED)
          .json({ message: `Saved to file: ${text}` });
      }
    });
  }

  @Get('/crash')
  crash() {
    throw new Error('Crash server!');
  }
}
