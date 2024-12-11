variable "environment" {
    description = "The environment in which the resources are being created"
    type        = string
}

variable "region" {
    description = "The AWS region to deploy to"
    type        = string
}

variable "frontend_image" {
    description = "The image to use for the frontend container"
    type        = string
}

variable "backend_image" {
    description = "The image to use for the backend container"
    type        = string
}

variable "database_url" {
    description = "The URL of the database"
    type        = string
}

variable "subnet_ids" {
    description = "The IDs of the subnets in which to place the ECS tasks"
    type        = list(string)
}

variable "frontend_sg_id" {
    description = "The ID of the security group to attach to the frontend ECS task"
    type        = string
}

variable "backend_sg_id" {
    description = "The ID of the security group to attach to the backend ECS task"
    type        = string
}

variable "ecs_task_execution_role" {
    description = "The ARN of the ECS task execution role"
    type        = string
}

variable "frontend_repository_url" {
    description = "The URL of the ECR repository for the frontend image"
    type        = string
}

variable "backend_repository_url" {
    description = "The URL of the ECR repository for the backend image"
    type        = string
}