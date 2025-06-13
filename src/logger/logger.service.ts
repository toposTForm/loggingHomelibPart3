import { ConsoleLogger, LoggerService, Injectable, NestMiddleware, Logger } from '@nestjs/common';
import * as fs from 'fs';
import  * as os from 'node:os'
import { Response } from '@nestjs/common';

@Injectable()
export class CustomLogger implements LoggerService {
  async log(message: any, ...optionalParams: any[]) {
    try {
      await fs.promises.appendFile(process.env.LOGFILE, `${message} ${new Date()} ${os.EOL}`, 'utf-8');
      let logOversized = (await fs.promises.stat(process.env.LOGFILE)).size;
      if (logOversized > Number(process.env.LOGSIZE) * 1024){
        while (logOversized > Number(process.env.LOGSIZE) * 1024){
          await logger(process.env.LOGFILE);
          logOversized = (await fs.promises.stat(process.env.LOGFILE)).size;
        }
      }
      let nestConsole = new ConsoleLogger;
      nestConsole.log(message);
    } catch (error) {
        console.log(`\x1b[31m%s\x1b[0m`, `Message ${message} could not be logged!`);
    }
  }
  async error(message: any, ...optionalParams: any[]) {
      try {
        await fs.promises.appendFile(process.env.ERRORFILE, `${message} ${new Date()} ${os.EOL}`, 'utf-8');
      let logOversized = (await fs.promises.stat(process.env.ERRORFILE)).size;
      if (logOversized > Number(process.env.ERRORFILE) * 1024){
        while (logOversized > Number(process.env.ERRORFILE) * 1024){
          await logger(process.env.ERRORFILE);
          logOversized = (await fs.promises.stat(process.env.ERRORFILE)).size;
        }
      }
      let nestConsole = new ConsoleLogger;
      nestConsole.log(message);
    } catch (error) {
        console.log(`\x1b[31m%s\x1b[0m`, `Error ${message} could not be logged!`);
    }
  }
  async warn(message: any, ...optionalParams: any[]) {
     try {
        await fs.promises.appendFile(process.env.WARNFILE, `${message} ${new Date()} ${os.EOL}`, 'utf-8');
      let logOversized = (await fs.promises.stat(process.env.WARNFILE)).size;
      if (logOversized > Number(process.env.WARNFILE) * 1024){
        while (logOversized > Number(process.env.WARNFILE) * 1024){
          await logger(process.env.WARNFILE);
          logOversized = (await fs.promises.stat(process.env.WARNFILE)).size;
        }
      }
      let nestConsole = new ConsoleLogger;
      nestConsole.log(message);
    } catch (error) {
        console.log(`\x1b[31m%s\x1b[0m`, `Warning ${message} could not be logged!`);
    }
  }
  
}

export const logger = async function logger(filname: string) {
  let logFile = await fs.promises.readFile(filname, 'utf-8');
  let lines = logFile.split(`\n`);
  const refabrishedLines = lines.filter((_, index) => index !== 0);
  let newContent = refabrishedLines.join('\n');
  await fs.promises.writeFile(filname, newContent, 'utf-8');
}

// @Injectable()
// export class LoggerMiddleware implements NestMiddleware {
//     use(req: Request, res: Response, next: Function) {
//         let id = req.url
//         let body = req.body;
//         let method = req.method;
//         next();
//     }
// }