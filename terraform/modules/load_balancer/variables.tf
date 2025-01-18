variable "environment" {
    description = "The environment in which the resources are being created"
    type        = string
}

variable "security_groups" {
    description = "The security groups to attach to the load balancer"
    type        = list(string)
}

variable "public_subnet_ids" {
    description = "The subnets in which the load balancer will be placed"
    type        = list(string)
}

variable "vpc_id" {
    description = "The VPC in which the load balancer will be placed"
    type        = string
}

variable "frontend_health_check_path" {
    description = "The path to use for the frontend health check"
    type        = string
    default     = "/health"
}

variable "backend_health_check_path" {
    description = "The path to use for the backend health check"
    type        = string
    default     = "/"
}
