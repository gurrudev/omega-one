#!/usr/bin/env node

import inquirer from 'inquirer';
import * as fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import createDirectoryContents from './createDirectoryContents.js';

const CURR_DIR = process.cwd();
const __dirname = dirname(fileURLToPath(import.meta.url));

const LANGUAGES = ['JavaScript', 'TypeScript'];

const QUESTIONS = [
    {
        name: 'project-name',
        type: 'input',
        message: 'Project Name:',
        validate: function (input) {
            if (input === './' || /^([A-Za-z\-\\_\d])+$/.test(input)) return true;
            else
                return "Project name may only include letters, numbers, underscores, hashes, or './' for the current directory.";
        },
    },
    {
        name: 'language-choice',
        type: 'list',
        message: 'Select Variant:',
        choices: LANGUAGES,
    },
    {
        name: 'include-mongoose',
        type: 'confirm',
        message: 'Would you like to include Mongoose?',
        default: false,
    },
    {
        name: 'include-eslint',
        type: 'confirm',
        message: 'Would you like to include ESLint?',
        default: false,
    },
    {
        name: 'include-prettier',
        type: 'confirm',
        message: 'Would you like to include Prettier?',
        default: false,
    },
];

// Check if 'create' command is used
const args = process.argv.slice(2);
if (args[0] === 'omega-one') {
    inquirer.prompt(QUESTIONS).then(answers => {
        const projectName = answers['project-name'];
        const languageChoice = answers['language-choice'];
        const includeMongoose = answers['include-mongoose'];
        const includeEslint = answers['include-eslint'];
        const includePrettier = answers['include-prettier'];
        const templateName = languageChoice === 'JavaScript' ? 'js-template' : 'ts-template';
        const templatePath = path.join(__dirname, 'templates', templateName);
        const projectPath = projectName === './' ? CURR_DIR : path.join(CURR_DIR, projectName);

        if (projectName !== './') {
            fs.mkdirSync(projectPath);
        }

        createDirectoryContents(templatePath, projectPath);

        if (includeMongoose) {
            addMongoose(projectPath, languageChoice);
        }
        if (includeEslint) {
            addEslint(projectPath);
        }
        if (includePrettier) {
            addPrettier(projectPath);
        }

        console.log(`Project created in ${projectPath} using ${languageChoice}`);
        if (includeMongoose) console.log('Mongoose has been included.');
        if (includeEslint) console.log('ESLint has been included.');
        if (includePrettier) console.log('Prettier has been included.');
    });
} else {
    console.log("Please run with the 'npx create omega-one' command.");
}

// Function to add Mongoose
function addMongoose(projectPath, languageChoice) {
    const mongoosePackage = {
        dependencies: {
            mongoose: '^5.12.3',
        },
    };
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    Object.assign(packageJson.dependencies, mongoosePackage.dependencies);
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

    const dbConfigContent =
        languageChoice === 'JavaScript'
            ? `import mongoose from 'mongoose';

const connectDB = async (MONGO_URI) => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

export default connectDB;`
            : `import mongoose from 'mongoose';

const connectDB = async (MONGO_URI: string): Promise<void> => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
        } else {
            console.error('An unknown error occurred');
        }
        process.exit(1);
    }
};

export default connectDB;`;

    const dbConfigPath = path.join(projectPath, 'config', 'db');
    fs.mkdirSync(dbConfigPath, { recursive: true });
    fs.writeFileSync(
        path.join(dbConfigPath, languageChoice === 'JavaScript' ? 'dbConfig.js' : 'dbConfig.ts'),
        dbConfigContent,
        'utf8'
    );
}

// Function to add ESLint
function addEslint(projectPath) {
    const eslintConfig = {
        devDependencies: {
            eslint: '^7.23.0',
        },
        eslintConfig: {
            extends: ['eslint:recommended', 'plugin:prettier/recommended'],
            env: {
                es2021: true,
                node: true,
            },
            parserOptions: {
                ecmaVersion: 12,
                sourceType: 'module',
            },
            rules: {
                'prettier/prettier': 'error',
            },
        },
    };
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    Object.assign(packageJson.devDependencies, eslintConfig.devDependencies);
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

    const eslintRcContent = `export default {
        env: {
            es2021: true,
            node: true,
        },
        extends: ['eslint:recommended', 'plugin:prettier/recommended'],
        parserOptions: {
            ecmaVersion: 12,
            sourceType: 'module',
        },
        rules: {
            'prettier/prettier': 'error',
        },
    };`;
    fs.writeFileSync(path.join(projectPath, '.eslintrc.js'), eslintRcContent, 'utf8');
}

// Function to add Prettier
function addPrettier(projectPath) {
    const prettierConfig = {
        devDependencies: {
            prettier: '^2.2.1',
        },
        prettier: {
            singleQuote: true,
            trailingComma: 'all',
        },
    };
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    Object.assign(packageJson.scripts, { format: 'prettier --write .' });
    Object.assign(packageJson.devDependencies, prettierConfig.devDependencies);
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

    const prettierRcContent = {
        singleQuote: true,
        trailingComma: 'all',
        tabWidth: 4,
    };
    fs.writeFileSync(
        path.join(projectPath, '.prettierrc'),
        JSON.stringify(prettierRcContent, null, 2),
        'utf8'
    );
}
