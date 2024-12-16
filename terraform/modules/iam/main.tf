resource "aws_iam_role" "ecs_task_execution_role" {
    name = "${var.environment}-ecs-task-execution-role"
    assume_role_policy = jsonencode({
        Version = "2012-10-17",
        Statement = [
        {
            Effect = "Allow",
            Principal = {
            Service = "ecs-tasks.amazonaws.com"
            },
            Action = "sts:AssumeRole"
        }
        ]
    })
    tags = {
        Name        = "interview-prep-ecs-task-execution-role"
        Environment = var.environment
    }
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
    role       = aws_iam_role.ecs_task_execution_role.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "ecr_pull_policy" {
    role       = aws_iam_role.ecs_task_execution_role.name
    policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_role" "ecs_task_role" {
    name = "${var.environment}-ecs-task-role"
    assume_role_policy = jsonencode({
        Version = "2012-10-17",
        Statement = [
            {
                Effect = "Allow",
                Principal = {
                    Service = "ecs-tasks.amazonaws.com"
                },
                Action = "sts:AssumeRole"
            }
        ]
    })
    tags = {
        Name        = "interview-prep-ecs-task-role"
        Environment = var.environment
    }
}

resource "aws_iam_role_policy_attachment" "ecs_task_role_policy" {
    role       = aws_iam_role.ecs_task_role.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "ecs_task_role_ssm_policy" {
    role       = aws_iam_role.ecs_task_role.name
    policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}
