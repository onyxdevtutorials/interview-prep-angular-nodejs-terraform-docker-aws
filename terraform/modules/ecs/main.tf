resource "aws_ecs_cluster" "main" {
    name = "${var.environment}-ecs-cluster"
}

resource "aws_ecs_task_definition" "frontend" {
    family                   = "${var.environment}-frontend-ecs-task"
    network_mode             = "awsvpc"
    requires_compatibilities = ["FARGATE"]
    cpu                      = "256"
    memory                   = "512"
    execution_role_arn = var.ecs_task_execution_role

    container_definitions = jsonencode([
        {
            name = "frontend"
            image = "${var.frontend_image}" # previously was "${aws_ecr_repository.frontend.repository_url}:latest"
            essential = true
            portMappings = [
                {
                    containerPort = 80
                    hostPort      = 80
                    protocol      = "tcp"
                }
            ]
        }
    ])
}

resource "aws_ecs_task_definition" "backend" {
    family                   = "${var.environment}-backend-ecs-task"
    network_mode             = "awsvpc"
    requires_compatibilities = ["FARGATE"]
    cpu                      = "256"
    memory                   = "512"
    execution_role_arn = var.ecs_task_execution_role

    container_definitions = jsonencode([
        {
            name = "backend"
            image = "${var.backend_image}" # previously was "${aws_ecr_repository.backend.repository_url}:latest"
            essential = true
            portMappings = [
                {
                    containerPort = 3000
                    hostPort      = 3000
                }
            ],
            environment = [
                {
                    name = "DATABASE_URL"
                    value = "${var.database_url}" # previously was "postgres://$${DB_USERNAME}:$${DB_PASSWORD}@interviewprepdbinstance:5432/interviewprepdb"
                }
            ]
        }
    ])
}

resource "aws_ecs_service" "frontend" {
    name            = "${var.environment}-frontend-ecs-service"
    cluster         = aws_ecs_cluster.main.id
    task_definition = aws_ecs_task_definition.frontend.arn
    desired_count   = 1
    launch_type = "FARGATE"

    network_configuration {
        subnets          = var.subnet_ids
        security_groups  = [var.frontend_sg_id]
        assign_public_ip = true
    }
}

resource "aws_ecs_service" "backend" {
    name            = "${var.environment}-backend-ecs-service"
    cluster         = aws_ecs_cluster.main.id
    task_definition = aws_ecs_task_definition.backend.arn
    desired_count   = 1
    launch_type = "FARGATE"

    network_configuration {
        subnets         = var.subnet_ids
        security_groups = [var.backend_sg_id]
        assign_public_ip = false
    }
}
