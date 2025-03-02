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

variable "frontend_domain_name" {
    description = "The domain name for the frontend"
    type        = string
}

variable "zone_id" {
    description = "The Route 53 zone ID for the domain"
    type        = string
}

variable "frontend_cert_arn" {
    description = "The ARN of the certificate for the frontend"
    type        = string
}