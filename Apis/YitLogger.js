const { createLogger, format, transports } = require('winston');

const logConfiguration = {
    transports: [
        new transports.Console({
            level: 'warn'
        }),
        new transports.File({
            level: 'error',
            // Create the log directory if it does not exist
            filename: 'Logs/example.log'
        })
    ],
    format: format.combine(

        format.timestamp({
            format: 'MMM-DD-YYYY HH:mm:ss'
        }),
        format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
    )
};

const YitLogger = createLogger(logConfiguration)

module.exports = YitLogger