# InterviewPrep

This project grew out of wanting to prepare for an interview for a job that would have focused on Angular. As I had been using React exclusively for several months, I needed to refresh my Angular skills. Then I began to add more things to make up for my focus on AWS Amplify. The result is in some ways the opposite of what I have in my previous videos:

* Angular instead of React/NextJS
* Angular Material instead of AWS Amplify's UI library. (I do, however, use Tailwind CSS in both.)
* Postgres instead of DynamoDB (SQL vs NoSQL)
* REST (using a NodeJS/Express backend) vs GraphQL (using Amplify and AppSync)
* This project has nothing in regard to authentication (yet), while the Amplify project implemented authentication right at the beginning.

Also, in the Amplify project I haven't yet implemented any automated testing but in this project I have unit and integration tests. I set up a GitHub Workflow with GitHub Actions to run the tests when there is a push to or a pull request on specified branches.

This project is Dockerized, and I developed it in a devcontainer. 

You'll see some Terraform files in the project but I'll get to that in the next video.

## Devcontainer

I'm using the [Node.js & TypeScript (typescript-node)](https://github.com/devcontainers/templates/tree/main/src/typescript-node) devcontainer. The features I added are

* [sshpass](https://github.com/hspaans/devcontainer-features/tree/master/src/sshpass): installs the GitHub CLI
* [Angular CLI](https://github.com/devcontainers-extra/features/tree/main/src/angular-cli)
* [docker-outside-of-docker](https://github.com/devcontainers/features/tree/main/src/docker-outside-of-docker): "Re-use the host docker socket, adding the Docker CLI to a container. Feature invokes a script to enable using a forwarded Docker socket within a container to run Docker commands."
* [Prettier](https://github.com/devcontainers-community/npm-features/tree/main/src/prettier)
* [AWS CLI](https://github.com/devcontainers/features/tree/main/src/aws-cli)
* [Terraform](https://github.com/devcontainers/features/tree/main/src/terraform)
* [PostgreSQL Client](https://github.com/robbert229/devcontainer-features/blob/main/src/postgresql-client/README.md)

In `devcontainer.json` you'll see that I'm specifying a network. That's so the devcontainer and the Docker services can communicate with one another. For instance, from a shell within the devcontainer I can connect to the service running the Postgres test database.

I also have some mounts so that

* git can authenticate with GitHub using the SSH agent on my laptop (the host machine)
* devcontainer can communicate with the host's Docker daemon
* the AWS credentials and configuration are available within the devcontainer.

### NOTE

I'm having a peculiar issue with bind mounts in `docker-compose.yml` when I try to use a relative reference. For example, the following *should* (I believe) bind the `backend` directory within root directory of my app (`interview-prep`) in the devcontainer to the `/app/backend` directory within the backend service:
```yaml
services:
  backend:
    volumes:
      - ./backend:/app/backend
```
Unfortunately, I get an error saying...
```
Attaching to frontend-1
Error response from daemon: Mounts denied: 
The path /workspaces/interview-prep/backend is not shared from the host and is not known to Docker.
You can configure shared paths from Docker -> Preferences... -> Resources -> File Sharing.
See https://docs.docker.com/desktop/mac for more info.
```
That error isn't helpful, as `workspaces` isn't even a "real" directory and can't be added to shared paths. In any event, I wouldn't want every user of a project to have to specify a directory on his or her host machine; a devcontainer shouldn't require that. I can get around the error by supplying a full, absolute path, e.g., `/Users/davidsilva/Dev/interview-prep/backend:/app/backend`, or by doing what I'm doing until I can figure out the relative directory thing -- namely, setting an environment variable in `devcontainer.json`,
```json
  "remoteEnv": {
    "HOST_PROJECT_PATH": "${localWorkspaceFolder}"
  },
```
and using `HOST_PROJECT_PATH` in `docker-compose.yml`:
```yaml
services:
  backend:
    volumes:
      - ${HOST_PROJECT_PATH}/backend:/app/backend
```

## Frontend

The frontend app, which uses Angular 18, is pretty simple: featurewise, it allows listing, creating and editing users and products.

What are some technical aspects of Angular, Angular Material and RxJS that it demonstrates?

* [Built-in flow control](https://blog.angular.dev/introducing-angular-v17-4d7033312e4b), e.g., @if vs *ngIf. It's more readable and supposed to be more performant. New in Angular 17.
* [Angular Material 3](https://material.angular.io/guides) components.
* [Standalone components](https://angular.dev/guide/components/importing#standalone-components).
* [Dependency injection using `inject()`](https://angular.dev/tutorials/learn-angular/20-inject-based-di). (Introduced in Angular 14.)
* [Reactive forms](https://angular.dev/guide/forms/reactive-forms) and form validation.
* [Signal inputs](https://angular.dev/guide/signals/inputs). (In developer preview as of 2024-11-06.)
* [Observables](https://rxjs.dev/guide/overview).
* [Custom pipes](https://angular.dev/tutorials/learn-angular/24-create-a-pipe).
* An implementation of an Angular Material's [ErrorStateMatcher](https://material.angular.io/components/core/api#ErrorStateMatcher).
* [Injectable services](https://angular.dev/guide/di).
* [Routing](https://angular.dev/guide/routing).

Jasmine and Karma are used for testing.

## Backend

The backend app uses NodeJS and Express to provide a REST API for getting, creating, updating and deleting products and users in a Postgres database. It uses Joi for validation. I added some middleware for handling errors and logging.

The PostgreSQL database is created using the official PostgreSQL Docker image. Environment variables can be provided from `.env.local` following the example of `.env.example`.

Jest is used for testing.

## Shared

Both the frontend and backend apps use an NPM package `@onyxdevtutorials/interview-prep-shared` that defines TypeScript interfaces for `product` and `user`. The source code for the package is in `shared`.

## Workflow and Continuous Integration (CI)

`.gihub/workflows/ci.yml` runs the frontend and backend tests when there are pushes to or pull requests on specified branches. The results can be viewed in the GitHub UI.

## Building the App

Prerequisites:

* [Docker desktop app](https://www.docker.com/) installed and running.
* [VSCode](https://code.visualstudio.com/) with the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

1. Command-P and choose Dev Containers: Clone Repository in Container Volume...
1. Specify this repo and choose the Development branch.
1. Create `.env.local` and `.env.test` files based on `.env.example` and customize the values as necessary.
1. Open a terminal and run `docker-compose --env-file .env.local build`.
1. `export NODE_ENV=local`
1. Run migrations to set up the database tables: `docker-compose --env-file .env.local -f docker-compose.yml -f docker-compose.migrate.yml up`

## Run the App

1. `docker-compose --env-file .env.local up frontend` (The dependent services should come up automatically.)
1. Load `http://localhost:4200/` in a web browser. You should be able to add new users and products, edit them, and list them.

## Running Tests

To run both frontend and backend tests:

1. `docker-compose --env-file .env.test -f docker-compose.test.yml up`

To run just frontend tests:

1. `docker-compose --env-file .env.test -f docker-compose.test.yml up frontend-tests`

To run just backend tests:

1. `docker-compose --env-file .env.test -f docker-compose.test.yml up backend-tests`

### Backend

1. `docker-compose --env-file .env.test up backend-tests`

To view test and coverage reports in a web browser:

1. Bring up the backend with `docker-compose --env-file .env.test up backend`
1. In a separate terminal window, `cd` into `backend`.
1. `npm run test:coverage`. That will run all the tests and a coverage report.
1. `npm run serve:report`. This will bring up a pretty web page at `http://localhost:8080/` where you should be able to look at test and coverage reports.

#### Note

I thought it would be nice to have a *live* web display of test results and coverage but that's problematic. Practically speaking it's probably best or easiest just to run `npm run test:watch` as you make code changes; that will present the familiar terminal based interface to give you feedback on particular code you change and tests you write. 

### Frontend

1. `docker-compose --env-file .env.test -f docker-compose.test.yml up frontend-tests` (At the moment I don't have any pretty web reports set up.)

Tests can also be run in watch mode so that they will be re-run as you make changes to code and tests:

1. `docker-compose --env-file .env.local up frontend`
1. `cd frontend`
1. `npm run test:watch`

## Version History

### 0.0.0
- Created a frontend app with views for adding and updating users and products, with services to talk to the REST API of the backend.
- Created a backend app to persist users and products in a PostgreSQL database and provide a REST API for the frontend.
- Created unit and integration tests for frontend and backend.
- Dockerized the application and set it up to use a devcontainer.
- Created a GitHub workflow to run tests when there push to or pull request on development, stage or production branches.
