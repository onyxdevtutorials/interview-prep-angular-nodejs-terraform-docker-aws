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

resource "aws_iam_role" "lambda_exec" {
    name = "${var.environment}-interview-prep-lambda-exec"
    assume_role_policy = jsonencode({
        Version = "2012-10-17",
        Statement = [
            {
                Effect = "Allow",
                Principal = {
                    Service = "lambda.amazonaws.com"
                },
                Action = "sts:AssumeRole"
            }
        ]
    })
    tags = {
        Name        = "interview-prep-lambda-exec"
        Environment = var.environment
    }
}

resource "aws_iam_policy" "lambda_exec_policy" {
    name = "${var.environment}-interview-prep-lambda-exec-policy"
    description = "Policy for Lambda execution role"
    policy = jsonencode({
        Version = "2012-10-17",
        Statement = [
            {
                Effect = "Allow",
                Action = [
                    "logs:CreateLogGroup",
                    "logs:CreateLogStream",
                    "logs:PutLogEvents"
                ],
                Resource = "arn:aws:logs:*:*:*"
            },
            {
                Effect = "Allow",
                Action = [
                    "ec2:CreateNetworkInterface",
                    "ec2:DescribeNetworkInterfaces",
                    "ec2:DeleteNetworkInterface"
                ],
                Resource = "*"
            },
            {
                Effect = "Allow",
                Action = [
                    "ssm:GetParameters",
                    "ssm:GetParameter",
                    "ssm:GetParameterHistory",
                ],
                Resource = [
                    "arn:aws:ssm:${var.region}:${var.account_id}:parameter/interview-prep/${var.environment}/*"
                ]
            }
        ]
    })
}

resource "aws_iam_role_policy_attachment" "lambda_exec_policy_attachment" {
    role       = aws_iam_role.lambda_exec.name
    policy_arn = aws_iam_policy.lambda_exec_policy.arn
}

resource "aws_iam_policy" "lambda_ssm_policy" {
    name = "${var.environment}-interview-prep-lambda-ssm-policy"
    description = "Allow Lambda to read SSM parameters"
    policy = jsonencode({
        Version = "2012-10-17",
        Statement = [
            {
                Effect = "Allow",
                Action = [
                    "ssm:GetParameters",
                    "ssm:GetParameter",
                    "ssm:GetParameterHistory",
                ],
                Resource = "*"
            }
        ]
    })
}

resource "aws_iam_role_policy_attachment" "lambda_ssm_policy_attachment" {
    role       = aws_iam_role.lambda_exec.name
    policy_arn = aws_iam_policy.lambda_ssm_policy.arn
}
