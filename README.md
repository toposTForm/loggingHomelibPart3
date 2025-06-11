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

npm install
npx prisma generate

after starting DB:

npx prisma migrate dev --name init

for container creating and run:

docker compose -f docker-compose.yml up --build -d
docker compose -f docker-compose.yml up



DATABASE STARTED ON PORT=4000 localhost, DATABASE ON PORT 5432

YOU CAN CHOOSE ANOTHER PORTS IN .env if they are occupied in your PC

DOCKER IMAGE PUSHED ON:

romanuchjs/myhomelib:myHomelib
Manifest digest

sha256:dc160260a99458c78bbaf3630ea6fdd4c1ebc9bdb7d9c550a1d0cdaaf1f79a3a