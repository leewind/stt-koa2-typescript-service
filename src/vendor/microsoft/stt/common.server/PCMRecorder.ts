import { RiffPcmEncoder, Stream, ConvertArrayBuffer, LogDebug } from "../common/Exports";
import { IRecorder } from "./IRecorder";
import * as Wav from "node-wav";

export class PcmRecorder implements IRecorder {
    private mediaResources: IMediaResources;
    private buffer: Buffer;

    constructor(buffer: Buffer) {
        this.buffer = buffer;
    }

    public Record = (outputStream: Stream<ArrayBuffer>): void => {

        // ReadFile("test.wav").then((buffer: Buffer) => {
        //     return WavDecoder.decode(buffer);
        // }).

        const audioData = Wav.decode(this.buffer);
        const desiredSampleRate = 16000;
        let bufferSize = 2048;
        let isFirstFrameWritten: boolean = false;
        if (desiredSampleRate * 4 <= audioData.sampleRate) {
            bufferSize = 8192;
        } else if (desiredSampleRate * 2 <= audioData.sampleRate) {
            bufferSize = 4096;
        }

        const waveStreamEncoder = new RiffPcmEncoder(audioData.sampleRate, desiredSampleRate);

        for (var i = 0; i < audioData.channelData.length; i++) {
            const monoAudioChunk = audioData.channelData[i];
            let encodedAudioFrameWithRiffHeader: ArrayBuffer;
            let encodedAudioFrame: ArrayBuffer;
            if (outputStream) {
                if (isFirstFrameWritten) {
                    if (!encodedAudioFrame) {
                        encodedAudioFrame = waveStreamEncoder.Encode(false, monoAudioChunk);
                    }

                    outputStream.Write(encodedAudioFrame);
                } else {
                    if (!encodedAudioFrameWithRiffHeader) {
                        encodedAudioFrameWithRiffHeader =
                            waveStreamEncoder.Encode(true, monoAudioChunk);
                    }

                    outputStream.Write(encodedAudioFrameWithRiffHeader);
                    isFirstFrameWritten = true;
                }
            }
        }
    }

    public ReleaseMediaResources = (): void => {
        if (this.mediaResources) {
            if (this.mediaResources.scriptProcessorNode) {
                this.mediaResources.scriptProcessorNode.disconnect();
                this.mediaResources.scriptProcessorNode = null;
            }
            if (this.mediaResources.source) {
                this.mediaResources.source.disconnect();
                this.mediaResources.stream.getTracks().forEach((track: any) => track.stop());
                this.mediaResources.source = null;
            }
            if (this.mediaResources.context && this.mediaResources.context.state !== "closed") {
                this.mediaResources.context.close();
            }
        }
    }
}

interface IMediaResources {
    context: AudioContext;
    source: MediaStreamAudioSourceNode;
    scriptProcessorNode: ScriptProcessorNode;
    stream: MediaStream;
}
