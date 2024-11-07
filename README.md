# InterviewPrep

This project grew out of wanting to prepare for an interview for a job that would have focused on Angular. As I had been using React exclusively for several months, I needed to refresh my Angular skills. Then I began to add more things to make up for my focus on AWS Amplify. The result is in some ways the opposite of what I have in my previous videos:

* Angular instead of React/NextJS
* Angular Material instead of AWS Amplify's UI library. (I do, however, use Tailwind CSS in both.)
* Postgres instead of DynamoDB (Sql vs NoSQL)
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

TO COME.

## Building the App

Prerequisites:

* [Docker desktop app](https://www.docker.com/) installed and running.
* [VSCode](https://code.visualstudio.com/) with the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

1. Command-P and choose Dev Containers: Clone Repository in Container Volume...
1. Specify this repo and choose the Development branch.
1. Create `.env.local` and `.env.test` files based on `.env.example` and customize the values as necessary.
1. Open a terminal and run `docker-compose --env-file .env.local build`.
1. Run migrations to set up the database tables: `docker-compose --env-file .env.local up migrate`

## Run the App

1. `docker-compose --env-file .env.local up frontend` (The dependent services should come up automatically.)
1. Load `http://localhost:4200/` in a web browser. You should be able to add new users and products, edit them, and list them.

## Running Tests

### Backend

1. `docker-compose --env-file .env.test up backend-tests`

Other options for running backend tests:

1. Bring up the backend with `docker-compose --env-file .env.test up backend`
1. In a separate terminal window, `cd` into `backend`.
1. `npm run test:coverage`. That will run all the tests and a coverage report.
1. `npm run serve:report`. This will bring up a pretty web page at `http://localhost:8080/` where you should be able to look at test and coverage reports.

Note: I thought it would be nice to a live web display of test results and coverage but that's problematic. Practically speaking it's probably best or easiest just to run `npm run test:watch` as you make code changes; that will present the familiar terminal based interface to give you feedback on particular code you change and tests you write. 

### Frontend

1. `docker-compose --env-file .env.test up frontend-tests` (At the moment I don't have any pretty web reports set up.)



How to run the frontend app:

1. `cd frontend`
1. `npm run start`
1. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Backend

How to run the backend app:

1. `cd backend`
1. `npm run dev` (The backend uses port 3000.)

## Building for Production

### Frontend

1. `cd frontend`
1. `npm run build` (The build artifacts will be stored in the `dist/` directory.)

### Backend

1. `cd backend`
1. `npm run build` (compiled app will be in `dist/`)

## Running unit tests for frontend

TO COME. Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Run SSH Tunnel in Background

- Using port 5433 in order not to conflict with local db using standard 5432.
- 107.22.66.121 is Elastic IP for bastion host
  `ssh -f -i <PATH TO KEY-PAIR PEM> -L 5433:interviewprepdbinstance.c92egeoumrf1.us-east-1.rds.amazonaws.com:5432 ec2-user@107.22.66.121 -N`
- To keep SSH tunnel alive: `ssh -f -i <PATH TO KEY-PAIR PEM> -L 5433:interviewprepdbinstance.c92egeoumrf1.us-east-1.rds.amazonaws.com:5432 ec2-user@107.22.66.121 -N -o ServerAliveInterval=60 -o ServerAliveCountMax=3`

## Migrations

DB credentials and URLs are in `.env.local` and `.env.development`. Set the environment to be used: `export NODE_ENV=local` or `export NODE_ENV=production`.

Maybe obsolete:

You need an SSH tunnel to be able to run the migrations on the db in AWS. Check for a tunnel by using `ps aux | grep ssh`. It will look something like

```
davidsilva       69319   0.0  0.0 410379280   1904   ??  Ss   12:34PM   0:00.01 ssh -f -i /Users/davidsilva/Downloads/OnyxKeyPair.pem -L 5433:interviewprepdbinstance.c92egeoumrf1.us-east-1.rds.amazonaws.com:5432 ec2-user@107.22.66.121 -N
```

# SSH into Bastion Host

The security group only allows SSH connections from my VPN IP address.

- `ssh -i <PATH TO KEY-PAIR PEM> ec2-user@107.22.66.121`, where `107.22.66.121` is the IP of the bastion host.

# Run psql from Bastion Host

- `psql -h interviewprepdbinstance.c92egeoumrf1.us-east-1.rds.amazonaws.com -p 5432 -U dbadmin -d interviewprepdbinstance`. Supply password when prompted.
- Example command: `\d products` (output the structure of the "products" table).

# SSH into `interview-prep-app-instance` via Bastion Host

- Start ssh agent if it isn't already running: `eval "$(ssh-agent -s)"`.
- Add private key to the ssh agent: `ssh-add <PATH TO KEY-PAIR PEM>`.
- SSH into the bastion host with agent forwarding: `ssh -A -i <PATH TO KEY-PAIR PEM> ec2-user@107.22.66.121`, where `107.22.66.121` is the Elastic IP of the bastion host.
- SSH into app_instance `ssh ec2-user@10.0.5.216`, where `10.0.5.216` is the private IP address of `interview-prep-app-instance` (`i-06ce4967201932411`).

# How to Find Private IP Address of an EC2 Instance

`aws ec2 describe-instances --filters "Name=tag:Name,Values=<NAME OF YOUR INSTANCE>" --query 'Reservations[*].Instances[*].PrivateIpAddress' --output text`

# Steps to Dockerize Angular App, Push to AWS ECR Using AWS Copilot

- User/profile with AdministratorAccess. Options: Temporarily give the default user AdministratorAccess; create such a user for occassions like this; or (this would be hard) figure out exactly all the individual permissions you would need and create a user just with those permissions.

# Create the ECR repository

`aws ecr create-repository --repository-name interview-prep --region us-east-1 --profile aws-cli-user`

# Verify the repository

`aws ecr describe-repositories --region us-east-1 --profile aws-cli-user`

# Authenticate Docker to ECR

`aws ecr get-login-password --region us-east-1 --profile aws-cli-user | docker login --username AWS --password-stdin 909500381447.dkr.ecr.us-east-1.amazonaws.com`

# Build the Docker images

To run locally:

1. Authenticate Docker to ECR if necessary.
1. From the app root directory (parent of frontend and backend) run `docker build -t interview-prep-frontend:latest -f frontend/Dockerfile .`
1. `docker build -t interview-prep-backend:latest -f backend/Dockerfile .`

# Tag the Docker image

`docker tag interview-prep:latest 909500381447.dkr.ecr.us-east-1.amazonaws.com/interview-prep:latest`

# Push the Docker image to ECR

`docker push 909500381447.dkr.ecr.us-east-1.amazonaws.com/interview-prep:latest`

# Get IP Address of a Docker Container

`docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container_id>`
E.g.,
`docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' c611004f5595`

# Check Docker Network Settings

`docker network ls`

# Inspect Docker Container

`docker inspect interview-prep-frontend-1`

# Check the disk space usage by Docker resources

`docker system df`

# Remove Unused Docker Images

`docker image prune -a`

# Remove Unused Docker Containers

`docker container prune`

# Remove Unused Docker Volumes

`docker volume prune`

# Remove Unused Docker Volume Usage

`docker network prune`

# List Docker Volumes

`docker volume ls`

# Inspect a Particular Docker Volume

`docker volume inspect <VOLUME NAME>`

# Run Frontend Tests

`docker-compose --env-file .env.local up frontend-tests`

Or to do a build, too:

`docker-compose --env-file .env.local up --build frontend-tests`

Or:

`docker-compose --env-file .env.local build --no-cache frontend-tests`

`docker-compose --env-file .env.local up frontend-tests`

# Run Backend Tests

`docker-compose --env-file .env.test build backend-tests`
`docker-compose --env-file .env.test up backend-tests`

Run outside of Docker container:

`npm run test`

Could run in the background or in separate shell to have HTML reports loaded (and reloaded) in web browser:

`npm run serve:report`

# Shared

## Update, Build and Publish

1. Increase version number in `package.json`.
1. `npm run build`
1. `npm publish`

# Run the Whole App in Docker Locally

Everything except the tests will run because frontend is dependent upon backend, which is dependent upon db.
`docker-compose --env-file .env.local up --build frontend`

# Database

With `interview-prep-db-1` up and running, you can access the db via psql using...

`docker exec -it interview-prep-db-1 psql -U interviewprep_admin -d interviewprepdbinstance`

## Run Migrations

`docker-compose --env-file .env.local up migrate`

