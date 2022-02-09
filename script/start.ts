import { refactoringFiles } from './refactor';

const dir = './';
const mask = '.js';
const exception = 'global-var';
const text = '//Hello World!'

refactoringFiles(
	dir,
	mask,
	exception,
	text,
);

