import pino from "pino"

export const logger = pino({
    level: process.env.PINO_LOG_LEVEL || 'trace',
    timestamp: pino.stdTimeFunctions.isoTime,
    // transport: {target: 'pino-pretty'},
    redact: {
        paths: ["CMA_TOKEN"],
        censor: '[Redacted]'
    }
});

