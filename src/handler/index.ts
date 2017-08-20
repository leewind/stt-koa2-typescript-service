import {
    RecognitionMode,
    SpeechResultFormat
} from "../vendor/microsoft/stt/sdk/speech/Exports"
import {
    LogDebug
} from "../vendor/microsoft/stt/common/Exports"
import {
    RecognizerSetup,
    RecognizerStart,
    RecognizerStop,
    ReadFile
} from '../business/recognize'
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { delay } from "underscore";

let processLock = false;

export function recognize(ctx, next) {

    if(processLock){
        return next().then(() => {
            ctx.body = {
                code: -100,
                msg: "正在运行中无法进行解析"
            };
        });
    }else{

        processLock = true;

        // https://github.com/koajs/examples/blob/master/upload/app.js
        const file = ctx.request.body.files.file;
        const reader = fs.createReadStream(file.path);
        const filepath = path.join(os.tmpdir(), Date.now() + Math.random().toString() + '.wav');
        const stream = fs.createWriteStream(filepath);
        reader.pipe(stream);

        return next().then(() => {
            return ReadFile(filepath).then((buffer: Buffer) => {
                let recognizer = RecognizerSetup(RecognitionMode.Dictation, 'en-US', SpeechResultFormat['Detail'], 'eb244a3116ad4384ab49bbf379c874af', buffer);
                return RecognizerStart(recognizer).then((result: Array<any>) => {
                    ctx.body = { 
                        code: 0,
                        msg: "解析成功",
                        result 
                    };
                    RecognizerStop(recognizer);
                    delay(() => {
                        LogDebug("资源释放");
                        processLock = false;
                    }, 30*1000);
                }, (error: any) => {
                    processLock = false;
                    if(ctx){
                        try {
                            ctx.body = { 
                                code: -110,
                                msg: "解析失败",
                                result: "没有结果获得" 
                            };
                        } catch (error) {
                            
                        }
                    }
                });
            })

        })
    }
}

export function example(ctx, next) {
    const data = fs.readFileSync('public/index.html', 'utf8');
    ctx.body = data
}