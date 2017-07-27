import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import { readFile } from 'fs';
import {router} from './routes';
import { RecognizerSetup, RecognizerStart, RecognizerStop } from './handler/speechtotext'
import { RecognitionMode, SpeechResultFormat } from "./vendor/microsoft/stt/sdk/speech/Exports";

const ReadFile = (filepath: string) => {
    return new Promise((resolve, reject) => {
        readFile(filepath, (err, buffer) => {
            if (err) {
                return reject(err);
            }
            return resolve(buffer);
        });
    });
};

ReadFile('test.wav').then((buffer: Buffer) => {
    let recognizer = RecognizerSetup(RecognitionMode.Dictation, 'en-US', SpeechResultFormat['Simple'], 'eabdd9d57c334da2b7a06791157d2dd5', buffer);
    RecognizerStart(recognizer).OnSuccessContinueWith( (result: string) => {
        // result
    });
})

const app = new Koa();
app.use(bodyParser());
app.use(router.routes());
app.listen(30001, ()=> {
    console.log('>>| Listen on 30001');
});