## Omega One

Omega One is a Node.js server CLI tool that supports both JavaScript (JS) and TypeScript (TS).

### Features

- **`JavaScript` and `TypeScript` Support**: Choose between JavaScript and TypeScript templates.
- **`Express.js`**: Pre-configured with Express.js for building web applications.
- **`Mongoose` Integration**: Optionally include Mongoose for MongoDB interactions.
- **`ESLint`**: Optionally include ESLint for code linting.
- **`Prettier`**: Optionally include Prettier for code formatting.
- **Environment Configuration**: Uses dotenv for environment variable management.
- **`Logging`**: Configured with `Morgan` and rotating-file-stream for logging.
- **Handlebars**: Uses Handlebars as the templating engine.

### Getting Started

#### Prerequisites

- Node.js (>= 10.0.0)
- npm or pnpm

#### Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

#### Usage

To create a new project, run the following command:

```sh
npx create-omega-one
```
You will be prompted to provide the project name, choose between JavaScript and TypeScript, and optionally include Mongoose, ESLint, and Prettier.

### Scripts
* `start`: Starts the server.
* `dev`: Starts the server with nodemon for development.
* `test`: Runs tests (currently not specified).

### Project Structure

```sh
.eslintrc.js
.gitignore
.prettierrc
createDirectoryContents.js
index.js
package.json
pnpm-lock.yaml
LICENSE
README.md
templates/
    js-template/
        .env.example
        .gitignore
        app.js
        config/
            db/
        controllers/
            app.controller.js
        LICENSE
        logs/
        middlewares/
        models/
        package.json
        public/
        router/
        server.js
        utils/
        views/
    ts-template/
        .gitignore
        app.ts
        config/
        controller/
        LICENSE
        middlewares/
        models/
        package.json
        public/
        router/
        server.ts
        tsconfig.json
        utils/
```

### Contributing
Contributions are welcome! Please open an issue or submit a pull request.

### License
This project is licensed under the ISC License - see the LICENSE file for details.