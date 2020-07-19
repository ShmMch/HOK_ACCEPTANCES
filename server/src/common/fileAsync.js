import fs from 'fs';

export const readAllBytes = (filePath, encoding) => {
    return new Promise(function (resolve, reject) {        
        fs.readFile(filePath, encoding, (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
}

export const writeAllBytes = (filePath, buffer) => {
    return new Promise(function (resolve, reject) {
        fs.writeFile(filePath, buffer, "binary", function (err) {
            err ? reject(err) : resolve();
        });
    });
};