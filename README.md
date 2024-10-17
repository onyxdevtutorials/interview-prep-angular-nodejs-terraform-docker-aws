# InterviewPrep

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.4.

## Development

### Frontend

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

## Flyway and Migrations

DB credentials and URLs are in `.env.local` and `.env.production`. Note that for the production credentials, I'm using `localhost:5433` for the `FLYWAY_URL`: that's based on using an SSH tunnel and using a non-standard port to avoid conflicting with the locally running Postgresql.

Before running a migration, set the environment to be used: `export NODE_ENV=local` or `export NODE_ENV=production`.

If you haven't done so before, make `run-flyway.sh` executable with `chmod +x run-flyway.sh`.

You need an SSH tunnel to be able to run the Flyway migrations on the db in AWS. Check for a tunnel by using `ps aux | grep ssh`. It will look something like

```
davidsilva       69319   0.0  0.0 410379280   1904   ??  Ss   12:34PM   0:00.01 ssh -f -i /Users/davidsilva/Downloads/OnyxKeyPair.pem -L 5433:interviewprepdbinstance.c92egeoumrf1.us-east-1.rds.amazonaws.com:5432 ec2-user@107.22.66.121 -N
```

To run migrations, run `./run-flyway.sh`.

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

# Build the Docker image

`docker build -t interview-prep .`

# Tag the Docker image

`docker tag interview-prep:latest 909500381447.dkr.ecr.us-east-1.amazonaws.com/interview-prep:latest`

# Push the Docker image to ECR

`docker push 909500381447.dkr.ecr.us-east-1.amazonaws.com/interview-prep:latest`
