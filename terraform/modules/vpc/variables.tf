variable "environment" {
    description = "The environment for the resources (e.g., development, staging, production)"
    type = string
}

variable "vpc_cidr" {
    description = "The CIDR block for the VPC"
    type = string
}

variable "public_subnet_a_id" {
    description = "The ID of the public subnet A"
    type = string
}

variable "public_subnet_b_id" {
    description = "The ID of the public subnet B"
    type = string
}

variable "private_subnet_a_id" {
    description = "The ID of the private subnet A"
    type = string
}

variable "private_subnet_b_id" {
    description = "The ID of the private subnet B"
    type = string
}