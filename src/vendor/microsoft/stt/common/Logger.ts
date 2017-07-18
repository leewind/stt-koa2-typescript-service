import * as log4js from "log4js";

let logger = log4js.getLogger();
logger.level = 'debug';

const Debug = (message: any):void => {
  logger.debug(message);
}

export { Debug }