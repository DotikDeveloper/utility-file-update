"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refactoringFiles = void 0;
const fs = require('fs');
const path = require('path');
function refactoringFiles(checkFolders, mask, exceptions, text) {
    const log = console.log;
    const charset = 'utf8';
    log('running refactor...');
    const filterFiles = (file) => {
        const pathExt = path.extname(file);
        const fileName = path.basename(file);
        if (!pathExt.includes(mask)) {
            return;
        }
        if (fileName.includes(exceptions)) {
            return;
        }
        if (pathExt.includes(mask)) {
            changeFile(file);
        }
    };
    const changeFile = (file) => {
        const fd = fs.openSync(file, 'r+');
        fs.readFile(file, charset, (err, data) => {
            if (err)
                throw err;
            const dataTrue = data.includes(text);
            if (!dataTrue) {
                const newText = `${text}\n${data}`;
                const dataBuffer = Buffer.from(newText);
                fs.write(fd, dataBuffer, 0, dataBuffer.length, 0, (err) => {
                    if (err)
                        return console.error(err);
                    log(`text (${text}) added in ${path.basename(file)}`);
                });
            }
            log(`text not added in ${path.basename(file)}`);
        });
    };
    const recursiveSearch = (checkPath) => {
        fs.stat(checkPath, (err, stats) => {
            if (err)
                throw err;
            if (stats.isFile()) {
                return filterFiles(checkPath);
            }
            if (stats.isDirectory()) {
                fs.readdir(checkPath, (err, data) => {
                    if (err)
                        throw err;
                    data.forEach(d => {
                        const dPath = path.join(checkPath, d);
                        fs.stat(dPath, (err, s2) => {
                            if (err)
                                throw err;
                            if (s2.isFile()) {
                                return filterFiles(dPath);
                            }
                            if (stats.isDirectory()) {
                                recursiveSearch(path.resolve(dPath));
                            }
                        });
                    });
                });
            }
        });
    };
    recursiveSearch(checkFolders);
}
exports.refactoringFiles = refactoringFiles;
