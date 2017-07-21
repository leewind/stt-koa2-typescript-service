import * as fs from "fs";

const ConvertArrayBuffer = (buffer: Buffer) => {
    var arrayBuffer = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(arrayBuffer);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return arrayBuffer;
}

const ReadFile = (filepath: string) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, buffer) => {
            if (err) {
                return reject(err);
            }
            return resolve(buffer);
        });
    });
};

export { ConvertArrayBuffer, ReadFile }