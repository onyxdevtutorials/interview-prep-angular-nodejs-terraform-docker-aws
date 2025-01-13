output "ecs_task_execution_role_arn" {
  description = "The ARN of the ECS task execution role"
  value = aws_iam_role.ecs_task_execution_role.arn
}

output "ecs_task_role_arn" {
  description = "The ARN of the ECS task role"
  value = aws_iam_role.ecs_task_role.arn
}

output "lambda_exec_role_arn" {
  description = "The ARN of the Lambda execution role"
  value = aws_iam_role.lambda_exec.arn
}

output "vpc_flow_log_role_arn" {
  description = "The ARN of the VPC flow log role"
  value = aws_iam_role.vpc_flow_log_role.arn
}

output "api_gateway_cloudwatch_role_arn" {
  description = "The ARN of the API Gateway CloudWatch role"
  value = aws_iam_role.api_gateway_cloudwatch_role.arn
}