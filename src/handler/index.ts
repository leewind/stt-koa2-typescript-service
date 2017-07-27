import {
  RecognitionMode,
  SpeechResultFormat
} from "../vendor/microsoft/stt/sdk/speech/Exports"
import  { 
  RecognizerSetup, 
  RecognizerStart, 
  RecognizerStop, 
  ReadFile 
} from '../business/recognize'

export function recognize (ctx, next) {
    return next().then(() => {
        return ReadFile('test.wav').then((buffer: Buffer) => {
            let recognizer = RecognizerSetup(RecognitionMode.Dictation, 'en-US', SpeechResultFormat['Simple'], 'eabdd9d57c334da2b7a06791157d2dd5', buffer);
            return RecognizerStart(recognizer).then( (result: string) => {
                ctx.body = {result};
                RecognizerStop(recognizer);
            });
        })
    })
}