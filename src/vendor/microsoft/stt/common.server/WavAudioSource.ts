import {
    AudioSourceErrorEvent,
    AudioSourceEvent,
    AudioSourceInitializingEvent,
    AudioSourceOffEvent,
    AudioSourceReadyEvent,
    AudioStreamNodeAttachedEvent,
    AudioStreamNodeAttachingEvent,
    AudioStreamNodeDetachedEvent,
    AudioStreamNodeErrorEvent,
    CreateNoDashGuid,
    Deferred,
    Events,
    EventSource,
    IAudioSource,
    IAudioStreamNode,
    IStringDictionary,
    PlatformEvent,
    Promise,
    PromiseHelper,
    Stream,
    StreamReader,
    LogInfo,
} from "../common/Exports";

import { IRecorder } from "./IRecorder";

import * as _ from 'lodash';

export class WavAudioSource implements IAudioSource {

    private streams: IStringDictionary<Stream<ArrayBuffer>> = {};

    private id: string;

    private events: EventSource<AudioSourceEvent>;

    private initializeDeferral: Deferred<boolean>;

    private recorder: IRecorder;

    // private mediaStream: mediastream;

    // private toArrayBuffer(buffer:Buffer) {
    //     var arrayBuffer = new ArrayBuffer(buffer.length);
    //     var view = new Uint8Array(arrayBuffer);
    //     for (var i = 0; i < buffer.length; ++i) {
    //         view[i] = buffer[i];
    //     }
    //     return arrayBuffer;
    // }

    public constructor(recorder: IRecorder, audioSourceId?: string) {
        this.id = audioSourceId ? audioSourceId : CreateNoDashGuid();
        this.events = new EventSource();
        this.recorder = recorder;
    }

    public TurnOn = (): Promise<boolean> => {
        if (this.initializeDeferral) {
            return this.initializeDeferral.Promise();
        }

        this.initializeDeferral = new Deferred<boolean>();

        this.OnEvent(new AudioSourceInitializingEvent(this.id)); // no stream id

        // LogInfo('----------WavAudioSource.TurnOn.ReadFile----------')
        // fs.readFile('test.wav', (error: any, data:any) => { 
        //     let input = this.toArrayBuffer(data);
        //     if (error) {
        //         const errorMsg = `Error occured processing the user media stream. ${error}`;
        //         this.initializeDeferral.Reject(errorMsg);
        //         this.OnEvent(new AudioSourceErrorEvent(this.id, errorMsg));
        //     }else{
        //         this.mediaStream = input;
        //         this.OnEvent(new AudioSourceReadyEvent(this.id));
        //         this.initializeDeferral.Resolve(true);
        //     }
        // })

        _.defer(() => {
            LogInfo('----------WavAudioSource.TurnOn.Resolve----------');
            // this.mediaStream = mediastream({audio: true});
            this.OnEvent(new AudioSourceReadyEvent(this.id));
            this.initializeDeferral.Resolve(true);
        });

        return this.initializeDeferral.Promise();
    }

    public Id = (): string => {
        return this.id;
    }

    public Attach = (audioNodeId: string): Promise<IAudioStreamNode> => {
        this.OnEvent(new AudioStreamNodeAttachingEvent(this.id, audioNodeId));

        return this.Listen(audioNodeId).OnSuccessContinueWith<IAudioStreamNode>(
            (streamReader: StreamReader<ArrayBuffer>) => {
                this.OnEvent(new AudioStreamNodeAttachedEvent(this.id, audioNodeId));
                return {
                    Detach: () => {
                        streamReader.Close();
                        delete this.streams[audioNodeId];
                        this.OnEvent(new AudioStreamNodeDetachedEvent(this.id, audioNodeId));
                        this.TurnOff();
                    },
                    Id: () => {
                        return audioNodeId;
                    },
                    Read: () => {
                        return streamReader.Read();
                    },
                };
            });
    }

    public Detach = (audioNodeId: string): void => {
        if (audioNodeId && this.streams[audioNodeId]) {
            this.streams[audioNodeId].Close();
            delete this.streams[audioNodeId];
            this.OnEvent(new AudioStreamNodeDetachedEvent(this.id, audioNodeId));
        }
    }

    public TurnOff = (): Promise<boolean> => {
        for (const streamId in this.streams) {
            if (streamId) {
                const stream = this.streams[streamId];
                if (stream) {
                    stream.Close();
                }
            }
        }

        this.recorder.ReleaseMediaResources();

        this.OnEvent(new AudioSourceOffEvent(this.id)); // no stream now
        this.initializeDeferral = null;
        return PromiseHelper.FromResult(true);
    }

    public get Events(): EventSource<AudioSourceEvent> {
        return this.events;
    }

    private Listen = (audioNodeId: string): Promise<StreamReader<ArrayBuffer>> => {
        return this.TurnOn()
            .OnSuccessContinueWith<StreamReader<ArrayBuffer>>((_: boolean) => {
                const stream = new Stream<ArrayBuffer>(audioNodeId);
                this.streams[audioNodeId] = stream;

                try {
                    this.recorder.Record(stream);
                } catch (error) {
                    const errorMsg = `Error occured processing the user media stream. ${error}`;
                    this.initializeDeferral.Reject(errorMsg);
                    this.OnEvent(new AudioStreamNodeErrorEvent(this.id, audioNodeId, error));
                }

                return stream.GetReader();
            });
    }

    private OnEvent = (event: AudioSourceEvent): void => {
        this.events.OnEvent(event);
        Events.Instance.OnEvent(event);
    }

} 