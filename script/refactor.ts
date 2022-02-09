const fs = require('fs');
const path = require('path');

export function refactoringFiles(
									checkFolders: string,
									mask: string,
									exceptions: string,
									text: string,
								) {
	const log = console.log;
	const charset: string = 'utf8';
	
	log('running refactor...');
	
	const filterFiles = (file: string) => {
		const pathExt = path.extname(file);
		const fileName = path.basename(file);
		
		if (!pathExt.includes(mask)){
			return;
		}
		
		if (fileName.includes(exceptions)){
			return;
		}
		
		if (pathExt.includes(mask)) {
			changeFile(file);
		}
	}
	
	const changeFile = (file: any) => {
		const fd = fs.openSync(file, 'r+');
		fs.readFile(file, charset, (err: any, data: Buffer) => {
			if (err) throw err;
			const dataTrue = data.includes(text);
			
			if (!dataTrue) {
				const newText = `${text}\n${data}`;
				const dataBuffer = Buffer.from(newText);
				fs.write(fd, dataBuffer, 0, dataBuffer.length, 0, (err: any) => {
					if (err) return console.error(err);
					log(`text (${text}) added in ${path.basename(file)}`);
				})
			}
			log(`text not added in ${path.basename(file)}`);
		})
	};
	
	const recursiveSearch = (checkPath: string) => {
		fs.stat(checkPath, (err: any, stats: { isFile: () => boolean; isDirectory: () => boolean; }) => {
			if (err) throw err;
			if (stats.isFile()) {
				return filterFiles(checkPath);
			}
			if (stats.isDirectory()) {
				fs.readdir(checkPath, (err: any, data: any[]) => {
					if (err) throw err;
					data.forEach(d => {
						const dPath = path.join(checkPath, d);
						fs.stat(dPath, (err: any, s2: { isFile: () => any; }) => {
							if (err) throw err;
							if(s2.isFile()) {
								return filterFiles(dPath);
							}
							if(stats.isDirectory()) {
								recursiveSearch(path.resolve(dPath));
							}
						})
					})
				})
			}
		})
	}
	recursiveSearch(checkFolders);
}
