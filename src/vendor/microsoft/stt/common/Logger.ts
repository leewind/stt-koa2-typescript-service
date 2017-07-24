import { getLogger } from 'log4js';

const logger = getLogger();
logger.level = 'debug';

const LogDebug = (message: any): void => {
  logger.debug(message);
}

const LogInfo = (message: any): void => {
  logger.info(message);
}

const LogError = (message: any) => {
  logger.error(message);
}

export { LogDebug, LogInfo, LogError };