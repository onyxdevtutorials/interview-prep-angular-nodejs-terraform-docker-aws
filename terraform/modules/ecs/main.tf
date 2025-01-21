resource "aws_ecs_cluster" "main" {
    name = "${var.environment}-${var.project_name}-ecs-cluster"
}

resource "aws_ecs_task_definition" "frontend" {
    family                   = "${var.environment}-frontend-ecs-task"
    network_mode             = "awsvpc"
    requires_compatibilities = ["FARGATE"]
    cpu                      = "256"
    memory                   = "512"
    execution_role_arn = var.ecs_task_execution_role
    task_role_arn = var.ecs_task_role_arn

    container_definitions = jsonencode([
        {
            name = "frontend"
            image = "${var.frontend_repository_url}:latest"
            essential = true
            portMappings = [
                {
                    containerPort = 80
                    hostPort      = 80
                    protocol      = "tcp"
                }
            ],
            logConfiguration = {
                logDriver = "awslogs"
                options = {
                    "awslogs-group" = "/ecs/${var.environment}-ecs-log-group"
                    "awslogs-region" = var.region
                    "awslogs-stream-prefix" = "frontend"
                }
            },
            environment = [
                {
                    name = "NODE_ENV"
                    value = "development"
                }
            ],
            linuxParameters = {
                initProcessEnabled = true
            }
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
    task_role_arn = var.ecs_task_role_arn

    container_definitions = jsonencode([
        {
            name = "backend"
            image = "${var.backend_repository_url}"
            essential = true
            portMappings = [
                {
                    containerPort = 3000
                    hostPort      = 3000
                    protocol      = "tcp"
                }
            ],
            environment = [
                {
                    name = "DATABASE_URL"
                    value = "postgres://${var.db_username}:${var.db_password}@${var.database_url}/interview_prep_db"
                },
                {
                    name = "NODE_ENV"
                    value = "development"
                }
            ]
            logConfiguration = {
                logDriver = "awslogs"
                options = {
                    "awslogs-group" = "/ecs/${var.environment}-ecs-log-group"
                    "awslogs-region" = var.region
                    "awslogs-stream-prefix" = "backend"
                }
            },
            linuxParameters = {
                initProcessEnabled = true
            }
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
        subnets          = var.private_subnet_ids
        security_groups  = [var.frontend_sg_id, var.alb_sg_id]
        assign_public_ip = false
    }

    load_balancer {
        target_group_arn = var.frontend_target_group_arn
        container_name   = "frontend"
        container_port   = 80
    }

    enable_execute_command = true
}

resource "aws_ecs_service" "backend" {
    name            = "${var.environment}-backend-ecs-service"
    cluster         = aws_ecs_cluster.main.id
    task_definition = aws_ecs_task_definition.backend.arn
    desired_count   = 1
    launch_type = "FARGATE"

    network_configuration {
        subnets         = var.private_subnet_ids
        security_groups = [var.backend_sg_id, var.alb_sg_id]
        assign_public_ip = false
    }

    load_balancer {
        target_group_arn = var.backend_target_group_arn
        container_name   = "backend"
        container_port   = 3000
    }

    enable_execute_command = true
}

resource "aws_cloudwatch_log_group" "ecs_log_group" {
    name = "/ecs/${var.environment}-ecs-log-group"
    retention_in_days = 7

    tags = {
        Name = "${var.environment}-ecs-log-group"
        Environment = var.environment
    }
}