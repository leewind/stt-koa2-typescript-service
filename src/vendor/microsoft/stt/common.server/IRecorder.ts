import { Stream } from "../common/Exports";

export interface IRecorder {
    Record(outputStream: Stream<ArrayBuffer>): void;
    ReleaseMediaResources(): void;
}
