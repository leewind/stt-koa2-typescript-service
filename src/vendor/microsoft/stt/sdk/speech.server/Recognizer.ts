import { WavAudioSource, PcmRecorder } from "../../common.server/Exports";
import { IAudioSource, Promise, Storage } from "../../common/Exports";
import { IAuthentication, Recognizer, RecognizerConfig } from "../speech/Exports";
import { SpeechConnectionFactory } from "./SpeechConnectionFactory";

// const CreateRecognizer = (recognizerConfig: RecognizerConfig, authentication: IAuthentication): Recognizer => {
//     return CreateRecognizerWithPcmRecorder(
//         recognizerConfig,
//         authentication);
// };

// const CreateRecognizerWithPcmRecorder = (recognizerConfig: RecognizerConfig, authentication: IAuthentication): Recognizer => {
//     return CreateRecognizerWithCustomAudioSource(
//         recognizerConfig,
//         authentication,
//         new WavAudioSource(new PcmRecorder()));
// };

const CreateRecognizerWithCustomAudioSource = (recognizerConfig: RecognizerConfig, authentication: IAuthentication, audioSource: IAudioSource): Recognizer =>  {
    return new Recognizer (
        authentication,
        new SpeechConnectionFactory(),
        audioSource,
        recognizerConfig);
};

const CreateRecognizerWithPcmRecorderByInputBuffer = (recognizerConfig: RecognizerConfig, authentication: IAuthentication, buffer: Buffer): Recognizer => {
    return CreateRecognizerWithCustomAudioSource(
        recognizerConfig,
        authentication,
        new WavAudioSource(new PcmRecorder(buffer)));
};

export { CreateRecognizerWithCustomAudioSource, CreateRecognizerWithPcmRecorderByInputBuffer };

// export { CreateRecognizer, CreateRecognizerWithPcmRecorder,  CreateRecognizerWithCustomAudioSource, CreateRecognizerWithPcmRecorderByInputBuffer };
