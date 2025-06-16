# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
`
### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging



FOR CORRECT RUN PLS MAKE:

for dev version:

npm install
npx prisma generate

download postgres image from docker hub and set credentials from .env
after starting DB:

npx prisma migrate dev --name init


OR:

for container creating and run:

docker compose -f docker-compose.yml up --build -d
docker compose -f docker-compose.yml up
npx prisma migrate dev --name init

you also can run tests inside docker

you can stop the app volume in container and start it in develop mode to check logger


ALL LOGS pushed to "./src/logFiles" Folder



DATABASE STARTED ON PORT=4000 localhost, DATABASE ON PORT 5432

YOU CAN CHOOSE ANOTHER PORTS IN .env if they are occupied in your PC

