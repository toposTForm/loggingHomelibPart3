import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadGatewayException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
// import * as fs from 'fs';
// import * as os from 'node:os';
// import { logger } from './logger.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(catchError(() => throwError(() => new BadGatewayException())));
  }
}

// async function logFunc(
//   logIncommingMessage: object,
//   responseStatus: number,
//   logFile: string,
// ) {
//   await fs.promises.appendFile(
//     process.env.REQRESLOGFILE,
//     `INCOMMING_MESSAGE: {os.EOL} ${JSON.stringify(logIncommingMessage)} ${new Date()} ${os.EOL}`,
//     'utf-8',
//   );
//   await fs.promises.appendFile(
//     process.env.REQRESLOGFILE,
//     `RESPONSE_STATUS: ${responseStatus} ${new Date()} ${os.EOL}`,
//     'utf-8',
//   );
//   let logOversized = (await fs.promises.stat(process.env.REQRESLOGFILE)).size;
//   if (logOversized > Number(process.env.LOGSIZE) * 1024) {
//     while (logOversized > Number(process.env.LOGSIZE) * 1024) {
//       await logger(process.env.REQRESLOGFILE);
//       logOversized = (await fs.promises.stat(process.env.REQRESLOGFILE)).size;
//     }
//   }
//   const nestConsole = new ConsoleLogger();
//   console.log(`INCOMMING_MESSAGE: `);
//   nestConsole.log(logIncommingMessage);
//   nestConsole.log(`RESPONSE_STATUS: ${responseStatus} `);
// }
