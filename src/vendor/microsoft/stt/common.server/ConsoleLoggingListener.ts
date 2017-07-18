import { EventType, IEventListener, PlatformEvent } from "../common/Exports";
import * as log4js from "log4js";

let logger = log4js.getLogger();
logger.level = 'debug';

export class ConsoleLoggingListener implements IEventListener<PlatformEvent> {
    private logLevelFilter: EventType;

    public constructor(logLevelFilter: EventType = EventType.Warning) {
        this.logLevelFilter = logLevelFilter;
    }

    public OnEvent = (event: PlatformEvent): void => {
        if (event.EventType >= this.logLevelFilter) {
            const log = this.ToString(event);

            switch (event.EventType) {
                case EventType.Debug:
                    // tslint:disable-next-line:no-console
                    logger.debug(log);
                    break;
                case EventType.Info:
                    // tslint:disable-next-line:no-console
                    logger.info(log);
                    break;
                case EventType.Warning:
                    // tslint:disable-next-line:no-console
                    logger.warn(log);
                    break;
                case EventType.Error:
                    // tslint:disable-next-line:no-console
                    logger.error(log);
                    break;
                default:
                    // tslint:disable-next-line:no-console
                    logger.info(log);
                    break;
            }
        }
    }

    private ToString = (event: any): string => {
        const logFragments = [
            `${event.EventTime}`,
            `${event.Name}`,
        ];

        for (const prop in event) {
            if (prop && event.hasOwnProperty(prop) && prop !== "eventTime" && prop !== "eventType" && prop !== "eventId" && prop !== "name" && prop !== "constructor") {
                const value = event[prop];
                let valueToLog = "<NULL>";
                if (value !== undefined && value !== null) {
                    if (typeof (value) === "number" || typeof (value) === "string") {
                        valueToLog = value.toString();
                    } else {
                        valueToLog = JSON.stringify(value);
                    }
                }

                logFragments.push(`${prop}: ${valueToLog}`);
            }

        }

        return logFragments.join(" | ");
    }
}
