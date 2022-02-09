"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const refactor_1 = require("./refactor");
const dir = './';
const mask = '.js';
const exception = 'global-var';
const text = '//Hello World!';
(0, refactor_1.refactoringFiles)(dir, mask, exception, text);
