# environments/development/outputs.tf

output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.vpc.vpc_id
}

output "vpc_cidr_block" {
  description = "The CIDR block of the VPC"
  value       = module.vpc.vpc_cidr_block
}

output "internet_gateway_id" {
  description = "The ID of the Internet Gateway"
  value       = module.vpc.internet_gateway_id
}

output "ecs_cluster_id" {
  description = "The ID of the ECS cluster"
  value       = module.ecs.ecs_cluster_id
}

output "ecs_cluster_name" {
  description = "The name of the ECS cluster"
  value       = module.ecs.ecs_cluster_name
}

output "ecs_cluster_arn" {
  description = "The ARN of the ECS cluster"
  value       = module.ecs.ecs_cluster_arn
}

output "frontend_service_name" {
  description = "The name of the frontend ECS service"
  value       = module.ecs.frontend_service_name
}

output "backend_service_name" {
  description = "The name of the backend ECS service"
  value       = module.ecs.backend_service_name
}

output "rds_instance_endpoint" {
  description = "The endpoint of the RDS instance"
  value       = module.rds.db_instance_endpoint
}

output "ecs_task_execution_role_arn" {
  description = "The ARN of the ECS task execution role"
  value       = module.iam.ecs_task_execution_role_arn
}

output "bastion_public_ip" {
  description = "The public IP address of the bastion host"
  value       = module.bastion.bastion_public_ip
}

output "frontend_repository_url" {
    description = "The URL of the frontend ECR repository"
    value = module.ecr.frontend_repository_url
}

output "backend_repository_url" {
    description = "The URL of the backend ECR repository"
    value = module.ecr.backend_repository_url
}

output "frontend_image" {
    description = "The frontend image name"
    value = module.ecs.frontend_image
}

output "backend_image" {
    description = "The backend image name"
    value = module.ecs.backend_image
}

output "frontend_sg_id" {
    description = "The ID of the frontend security group"
    value = module.security_groups.frontend_sg_id
}

output "backend_sg_id" {
    description = "The ID of the backend security group"
    value = module.security_groups.backend_sg_id
}