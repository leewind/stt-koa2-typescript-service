import { RiffPcmEncoder, Stream, ConvertArrayBuffer, LogDebug } from "../common/Exports";
import { IRecorder } from "./IRecorder";
import * as fs from "fs";
import * as WavDecoder from "wav-decoder";

export class PcmRecorder implements IRecorder {
    private mediaResources: IMediaResources;
    // public Record = (mediaStream: MediaStream, outputStream: Stream<ArrayBuffer>): void => {
    public Record = (outputStream: Stream<ArrayBuffer>): void => {
        // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
        // const AudioContext = WebAudioApi.AudioContext
        // const audioContext = new AudioContext();

        // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaStreamSource
        // const mediaStreamSource = audioContext.createMediaStreamSource(mediaStream);


        const readFile = (filepath) => {
            return new Promise((resolve, reject) => {
                fs.readFile(filepath, (err, buffer) => {
                if (err) {
                    return reject(err);
                }
                return resolve(buffer);
                });
            });
        };

        readFile("test.wav").then((buffer) => {
            return WavDecoder.decode(buffer);
        }).then(function(audioData) {
            const desiredSampleRate = 16000;
            // let compressionRatio = mediaStreamSource.context.sampleRate / desiredSampleRate;
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


            // console.log(audioData.sampleRate);
            // console.log(audioData.channelData[0]); // Float32Array 
            // console.log(audioData.channelData[1]); // Float32Array 
        });



        // const desiredSampleRate = 16000;
        // // let compressionRatio = mediaStreamSource.context.sampleRate / desiredSampleRate;
        // let bufferSize = 2048;
        // let isFirstFrameWritten: boolean = false;
        // if (desiredSampleRate * 4 <= mediaStreamSource.context.sampleRate) {
        //     bufferSize = 8192;
        // } else if (desiredSampleRate * 2 <= mediaStreamSource.context.sampleRate) {
        //     bufferSize = 4096;
        // }

        // // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createScriptProcessor
        // // const scriptNode = mediaStreamSource.context.createScriptProcessor(bufferSize, 1, 1);
        // const scriptNode = fs.createReadStream("test.wav");
        // const waveStreamEncoder = new RiffPcmEncoder(mediaStreamSource.context.sampleRate, desiredSampleRate);

        // scriptNode.on('readable', () => {
        //     LogDebug('--------------PCMRecorder.scriptNode.read-------------')

        //     let buffer: Buffer;
        //     while(buffer = scriptNode.read(bufferSize)){

        //         // Float32Array
        //         let arrayBuffer = ConvertArrayBuffer(buffer);
        //         let dataview = new DataView(arrayBuffer);
        //         let monoAudioChunk = new Float32Array(arrayBuffer.byteLength / 4);
        //         for (var i = 0; i < monoAudioChunk.length; i++) {
        //             monoAudioChunk[i] = dataview.getFloat32(i * 4);
        //         }

        //         let encodedAudioFrameWithRiffHeader: ArrayBuffer;
        //         let encodedAudioFrame: ArrayBuffer;
        //         if (outputStream) {
        //             if (isFirstFrameWritten) {
        //                 if (!encodedAudioFrame) {
        //                     encodedAudioFrame = waveStreamEncoder.Encode(false, monoAudioChunk);
        //                 }

        //                 outputStream.Write(encodedAudioFrame);
        //             } else {
        //                 if (!encodedAudioFrameWithRiffHeader) {
        //                     encodedAudioFrameWithRiffHeader =
        //                         waveStreamEncoder.Encode(true, monoAudioChunk);
        //                 }

        //                 outputStream.Write(encodedAudioFrameWithRiffHeader);
        //                 isFirstFrameWritten = true;
        //             }
        //         }
        //     }
        // });

        // scriptNode.onaudioprocess = (audioProcessingEvent: AudioProcessingEvent) => {
        //     const monoAudioChunk = audioProcessingEvent.inputBuffer.getChannelData(0);

        //     let encodedAudioFrameWithRiffHeader: ArrayBuffer;
        //     let encodedAudioFrame: ArrayBuffer;
        //     if (outputStream) {
        //         if (isFirstFrameWritten) {
        //             if (!encodedAudioFrame) {
        //                 encodedAudioFrame = waveStreamEncoder.Encode(false, monoAudioChunk);
        //             }

        //             outputStream.Write(encodedAudioFrame);
        //         } else {
        //             if (!encodedAudioFrameWithRiffHeader) {
        //                 encodedAudioFrameWithRiffHeader =
        //                     waveStreamEncoder.Encode(true, monoAudioChunk);
        //             }

        //             outputStream.Write(encodedAudioFrameWithRiffHeader);
        //             isFirstFrameWritten = true;
        //         }
        //     }
        // };

        // this.mediaResources = {
        //     context: audioContext,
        //     scriptProcessorNode: scriptNode,
        //     source: mediaStreamSource,
        //     stream: mediaStream,
        // };

        // mediaStreamSource.connect(scriptNode);
        // scriptNode.connect(mediaStreamSource.context.destination);
    }

    public ReleaseMediaResources = (): void => {
        if (this.mediaResources) {
            if (this.mediaResources.scriptProcessorNode) {
                // this.mediaResources.scriptProcessorNode.disconnect();
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
