import * as fs from 'fs';
import path from 'path';

function createDirectoryContents(templatePath, newProjectPath) {
    const filesToCreate = fs.readdirSync(templatePath);

    filesToCreate.forEach(file => {
        const origFilePath = path.join(templatePath, file);

        const stats = fs.statSync(origFilePath);

        if (stats.isFile()) {
            const contents = fs.readFileSync(origFilePath, 'utf8');

            // Rename
            if (file === '.npmignore') file = '.gitignore';

            const writePath = path.join(newProjectPath, file);
            fs.writeFileSync(writePath, contents, 'utf8');
        } else if (stats.isDirectory()) {
            const dirPath = path.join(newProjectPath, file);
            fs.mkdirSync(dirPath);

            // Recursive call
            createDirectoryContents(path.join(templatePath, file), dirPath);
        }
    });
}

export default createDirectoryContents;
