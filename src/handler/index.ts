import {
    RecognitionMode,
    SpeechResultFormat
} from "../vendor/microsoft/stt/sdk/speech/Exports"
import {
    RecognizerSetup,
    RecognizerStart,
    RecognizerStop,
    ReadFile
} from '../business/recognize'
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export function recognize(ctx, next) {

    // https://github.com/koajs/examples/blob/master/upload/app.js
    const file = ctx.request.body.files.file;
    const reader = fs.createReadStream(file.path);
    const filepath = path.join(os.tmpdir(), Date.now() + Math.random().toString() + '.wav');
    const stream = fs.createWriteStream(filepath);
    reader.pipe(stream);

    return next().then(() => {
        return ReadFile(filepath).then((buffer: Buffer) => {
            let recognizer = RecognizerSetup(RecognitionMode.Dictation, 'en-US', SpeechResultFormat['Simple'], 'eb244a3116ad4384ab49bbf379c874af', buffer);
            return RecognizerStart(recognizer).then((result: string) => {
                ctx.body = { result };
                RecognizerStop(recognizer);
            });
        })
    })
}

export function example(ctx, next) {
    const data = fs.readFileSync('public/index.html', 'utf8');
    ctx.body = data
}