import { ConsoleLogger, LoggerService, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as os from 'node:os';
import * as dotenv from 'dotenv';
dotenv.config();

const LOGLEVEL = process.env.LOGLEVEL.split('&');
const logLevel = LOGLEVEL.find((level) => level == 'log');
const warnLevel = LOGLEVEL.find((level) => level == 'warn');
const errLevel = LOGLEVEL.find((level) => level == 'error');

@Injectable()
export class CustomLogger implements LoggerService {
  async log(message: any) {
    if (logLevel) {
      try {
        await fs.promises.appendFile(
          process.env.LOGFILE,
          `${message} ${new Date()} ${os.EOL}`,
          'utf-8',
        );
        let logOversized = (await fs.promises.stat(process.env.LOGFILE)).size;
        if (logOversized > Number(process.env.LOGSIZE) * 1024) {
          while (logOversized > Number(process.env.LOGSIZE) * 1024) {
            await logger(process.env.LOGFILE);
            logOversized = (await fs.promises.stat(process.env.LOGFILE)).size;
          }
        }
        const nestConsole = new ConsoleLogger();
        nestConsole.log(message);
      } catch (error) {
        console.log(
          `\x1b[31m%s\x1b[0m`,
          `Message ${message} could not be logged!`,
        );
      }
    }
  }
  async error(message: any) {
    if (errLevel) {
      try {
        await fs.promises.appendFile(
          process.env.ERRORFILE,
          `${message} ${new Date()} ${os.EOL}`,
          'utf-8',
        );
        let logOversized = (await fs.promises.stat(process.env.ERRORFILE)).size;
        if (logOversized > Number(process.env.ERRORFILE) * 1024) {
          while (logOversized > Number(process.env.ERRORFILE) * 1024) {
            await logger(process.env.ERRORFILE);
            logOversized = (await fs.promises.stat(process.env.ERRORFILE)).size;
          }
        }
        const nestConsole = new ConsoleLogger();
        nestConsole.log(message);
      } catch (error) {
        console.log(
          `\x1b[31m%s\x1b[0m`,
          `Error ${message} could not be logged!`,
        );
      }
    }
  }
  async warn(message: any) {
    if (warnLevel) {
      try {
        await fs.promises.appendFile(
          process.env.WARNFILE,
          `${message} ${new Date()} ${os.EOL}`,
          'utf-8',
        );
        let logOversized = (await fs.promises.stat(process.env.WARNFILE)).size;
        if (logOversized > Number(process.env.WARNFILE) * 1024) {
          while (logOversized > Number(process.env.WARNFILE) * 1024) {
            await logger(process.env.WARNFILE);
            logOversized = (await fs.promises.stat(process.env.WARNFILE)).size;
          }
        }
        const nestConsole = new ConsoleLogger();
        nestConsole.log(message);
      } catch (error) {
        console.log(
          `\x1b[31m%s\x1b[0m`,
          `Warning ${message} could not be logged!`,
        );
      }
    }
  }
}

export const logger = async function logger(filname: string) {
  const logFile = await fs.promises.readFile(filname, 'utf-8');
  const lines = logFile.split(`\n`);
  const refabrishedLines = lines.filter((_, index) => index !== 0);
  const newContent = refabrishedLines.join('\n');
  await fs.promises.writeFile(filname, newContent, 'utf-8');
};
