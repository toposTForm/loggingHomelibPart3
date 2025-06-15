import { Injectable, NestInterceptor, ExecutionContext, CallHandler, ConsoleLogger, HttpException } from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import * as fs from 'fs';
import  * as os from 'node:os'
import { logger } from './logger.service'


@Injectable()
export class LoggingInterceptor implements NestInterceptor {
   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let incommingMessage = context.getArgByIndex(0);
    let logIncommingMessage = {
        idAddr: incommingMessage.rawHeaders[9],
        url: incommingMessage.originalUrl,
        queryParams: incommingMessage.queryParams,
        method: incommingMessage.method,
        body: incommingMessage.body
    }
    let responseStatus = context.getArgByIndex(1).statusCode;
    try {
        logFunc(logIncommingMessage, responseStatus, process.env.REQRESLOGFILE);
    } catch (error) {
        console.log(`\x1b[31m%s\x1b[0m`, `Message ${incommingMessage} could not be logged!`);
    }
    return next
        .handle()
        .pipe(
            catchError(err => {
                console.error('Exception caught by interceptor:', err);
                if(err instanceof HttpException) {
                    try {
                        logFunc(err.message, err.getStatus(), process.env.EXCEPTIONSLOGFILE);
                    } catch (error) {
                        console.log(`\x1b[31m%s\x1b[0m`, `Message ${incommingMessage} could not be logged!`);
                    }
                    return throwError(() => new HttpException({
                    message: err.message,
                    status: err.getStatus(),
                    additionalInfo: 'This error was caught by the interceptor'
                    }, err.getStatus()));
                }
                return throwError(() => new HttpException('An unexpected error occurred', 500));
            }),
      );
  }
}

async function logFunc(logIncommingMessage: object | string, responseStatus: number, logFile: string) {
    await fs.promises.appendFile(logFile, `INCOMMING_MESSAGE: {os.EOL} ${JSON.stringify(logIncommingMessage)} ${new Date()} ${os.EOL}`, 'utf-8');
    await fs.promises.appendFile(logFile, `RESPONSE_STATUS: ${responseStatus} ${new Date()} ${os.EOL}`, 'utf-8');
    let logOversized = (await fs.promises.stat(logFile)).size;
    if (logOversized > Number(process.env.LOGSIZE) * 1024){
    while (logOversized > Number(process.env.LOGSIZE) * 1024){
        await logger(logFile);
        logOversized = (await fs.promises.stat(logFile)).size;
    }
    }
    let nestConsole = new ConsoleLogger;
    console.log(`INCOMMING_MESSAGE: `)
    nestConsole.log(logIncommingMessage);
    nestConsole.log(`RESPONSE_STATUS: ${ responseStatus} `);
}

process
  .on('unhandledRejection', (err) => {
    console.error(err, 'Unhandled Rejection Error');
    logFunc(err as string, null, process.env.EXCEPTIONSLOGFILE);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    logFunc(err.message as string, null, process.env.EXCEPTIONSLOGFILE);
    process.exit(1);
  });