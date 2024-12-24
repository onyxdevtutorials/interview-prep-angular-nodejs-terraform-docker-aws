output "lambda_function_arn" {
  description = "ARN of the lambda function"
  value       = aws_lambda_function.migrate.arn
}
