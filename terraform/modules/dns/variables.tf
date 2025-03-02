variable "environment" {
    description = "The environment in which the resources are being created"
    type        = string
}

variable "zone_id" {
    description = "The ID of the Route 53 hosted zone"
    type        = string
}

variable "frontend_record_name" {
    description = "The DNS record name for the frontend service"
    type        = string
}

variable "backend_record_name" {
    description = "The DNS record name for the backend service"
    type        = string
}

variable "lb_dns_name" {
    description = "The DNS name of the load balancer"
    type        = string
}

variable "lb_zone_id" {
    description = "The hosted zone ID of the load balancer"
    type        = string
}

variable "custom_domain_name" {
    description = "The custom domain name for api"
    type        = string
}

variable "custom_domain_zone_id" {
    description = "The custom domain zone ID for api"
    type        = string
}
