import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import {router} from './routes';
// import * as fs from "fs";
// import * as wav from 'wav';
// import * as Speaker from 'speaker';
// import { Stream } from "./vendor/microsoft/stt/common/Exports";

// let input: ArrayBuffer;
// const outputStream = new Stream<ArrayBuffer>(Date.now().toString());
// fs.readFile('test.wav', function(err, data){ 
//     //文件内容
//     input = data;
//     outputStream.Write(input);
    
// })

// var file = fs.createReadStream('test.wav');
// var reader = new wav.Reader();

// reader.on('format', function (format) {
// //   reader.pipe(new Speaker(format));
// //   console.log(reader)
// });

// file.pipe(reader);

const app = new Koa();
app.use(bodyParser());
app.use(router.routes());
app.listen(30001, ()=> {
    console.log('>>| Listen on 30001');
});