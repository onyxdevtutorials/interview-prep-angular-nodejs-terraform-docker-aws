variable "environment" {
    description = "The environment for the resources (e.g., development, staging, production)"
    type = string
}

variable "vpc_cidr" {
    description = "The CIDR block for the VPC"
    type = string
}

variable "subnet_id" {
    description = "The ID of the subnet for the NAT gateway"
    type = string
}