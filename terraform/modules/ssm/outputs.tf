output "db_host_param" {
  description = "SSM parameter name for the database host"
  value       = aws_ssm_parameter.db_host.name
}

output "db_port_param" {
  description = "SSM parameter name for the database port"
  value       = aws_ssm_parameter.db_port.name
}

output "db_name_param" {
  description = "SSM parameter name for the database name"
  value       = aws_ssm_parameter.db_name.name
}

output "db_user_param" {
  description = "SSM parameter name for the database user"
  value       = aws_ssm_parameter.db_user.name
}

output "db_pass_param" {
  description = "SSM parameter name for the database password"
  value       = aws_ssm_parameter.db_pass.name
}
