import {Request, Response} from 'express';
import winston from 'winston';
import bunyan from 'bunyan';
import {LoggingWinston} from '@google-cloud/logging-winston';
import {LoggingBunyan} from '@google-cloud/logging-bunyan';

export async function handler(_: Request, res: Response): Promise<Response> {
    const consoleLogMsg = 'by console log';
    console.info(`${consoleLogMsg} info`);
    console.log(`${consoleLogMsg} log`);
    console.warn(`${consoleLogMsg} warn`);
    console.error(`${consoleLogMsg} error`);
    console.debug(`${consoleLogMsg} debug`);

    const loggingWinston = new LoggingWinston();

    const logger = winston.createLogger({
        level: 'info',
        transports: [
            // log to console
            new winston.transports.Console(),
            // log to stackdriver
            loggingWinston,
        ],
    });

    const winstonLogMsg = 'by winston log';
    logger.info(`${winstonLogMsg} info`);
    // logger.log(`${winstonLogMsg} log`) Need LogEntry Obeject
    logger.error(`${winstonLogMsg} error`);
    logger.warn(`${winstonLogMsg} warn`);
    logger.debug(`${winstonLogMsg} debug`);


    const loggingBunyan = new LoggingBunyan();
    const loggerBunyan = bunyan.createLogger({
        // JSON PAYLOAD for my server
        name: 'my-service',
        streams: [
            // Log level to console
            {stream: process.stdout, level: 'info'},
            // And log to Stackdriver Logging
            loggingBunyan.stream('info'),
        ],
    });

    const bunyanLogMsg = 'by bunyan log';
    loggerBunyan.info(`${bunyanLogMsg} info`);
    // logger.log(`${winstonLogMsg} log`) Need LogEntry Obeject
    loggerBunyan.error(`${bunyanLogMsg} error`);
    loggerBunyan.warn(`${bunyanLogMsg} warn`);
    loggerBunyan.debug(`${bunyanLogMsg} debug`);


    return res.json({message: 'Hello'});
}
