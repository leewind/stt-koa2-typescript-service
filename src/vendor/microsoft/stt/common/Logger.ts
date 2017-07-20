import * as log4js from "log4js";

let logger = log4js.getLogger();
logger.level = 'debug'

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