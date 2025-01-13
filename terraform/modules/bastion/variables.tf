variable "vpc_id" {
    description = "The ID of the VPC"
    type = string
}

variable "public_subnet_id" {
    description = "The ID of the public subnet"
    type = string
}

variable "bastion_sg_id" {
    description = "The ID of the security group for the bastion host"
    type = string
}

variable "ami" {
    description = "The AMI to use for the bastion host"
    type = string
}

variable "instance_type" {
    description = "The instance type for the bastion host"
    type = string
}

variable "key_name" {
    description = "The name of the key pair to use for the bastion host"
    type = string
}

variable "environment" {
    description = "The environment for the resources (e.g., development, staging, production)"
    type = string
}