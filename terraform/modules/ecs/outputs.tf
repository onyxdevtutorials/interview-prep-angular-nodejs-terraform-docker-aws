output "ecs_cluster_id" {
  description = "The ID of the ECS cluster"
  value = aws_ecs_cluster.main.id
}

output "ecs_cluster_name" {
  description = "The name of the ECS cluster"
  value = aws_ecs_cluster.main.name
}

output "ecs_cluster_arn" {
  description = "The ARN of the ECS cluster"
  value = aws_ecs_cluster.main.arn
}

output "frontend_task_definition_arn" {
  description = "The ARN of the frontend ECS task definition"
  value = aws_ecs_task_definition.frontend.arn
}

output "backend_task_definition_arn" {
  description = "The ARN of the backend ECS task definition"
  value = aws_ecs_task_definition.backend.arn
}

output "frontend_service_name" {
    description = "The name of the frontend ECS service"
    value = aws_ecs_service.frontend.name
}

output "backend_service_name" {
    description = "The name of the backend ECS service"
    value = aws_ecs_service.backend.name
}

output "frontend_image" {
    description = "The frontend image"
    value = var.frontend_image
}

output "backend_image" {
    description = "The backend image"
    value = var.backend_image
}
