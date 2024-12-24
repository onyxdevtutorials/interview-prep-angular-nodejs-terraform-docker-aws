variable "environment" {
  description = "Environment name"
  type        = string  
}

variable "function_name" {
  description = "Name of the lambda function"
  type        = string
}

variable "handler" {
  description = "Handler for the lambda function"
  type        = string
}

variable "runtime" {
  description = "Runtime for the lambda function"
  type        = string
}

variable "lambda_package" {
  description = "Path to the lambda zip file"
  type        = string
}

variable "lambda_subnet_ids" {
  description = "Subnet ids for the lambda function"
  type        = list(string)
}

variable "lambda_sg_id" {
  description = "Security group id for the lambda function"
  type        = string
}

variable "db_host_param" {
  description = "SSM parameter name for the database host"
  type        = string
}

variable "db_port_param" {
  description = "SSM parameter name for the database port"
  type        = string
}

variable "db_name_param" {
  description = "SSM parameter name for the database name"
  type        = string
}

variable "db_user_param" {
  description = "SSM parameter name for the database user"
  type        = string
}

variable "db_pass_param" {
  description = "SSM parameter name for the database password"
  type        = string
}

variable "lambda_exec_role_arn" {
  description = "ARN of the role for the lambda function"
  type        = string
}