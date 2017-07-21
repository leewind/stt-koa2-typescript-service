import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import {router} from './routes';
import { RecognizerSetup, RecognizerStart, RecognizerStop } from './handler/speechtotext'
import { RecognitionMode, SpeechResultFormat } from "./vendor/microsoft/stt/sdk/speech/Exports"

let recognizer = RecognizerSetup(RecognitionMode.Interactive, 'en-US', SpeechResultFormat['Simple'], 'eabdd9d57c334da2b7a06791157d2dd5');
RecognizerStart(recognizer);

const app = new Koa();
app.use(bodyParser());
app.use(router.routes());
app.listen(30001, ()=> {
    console.log('>>| Listen on 30001');
});