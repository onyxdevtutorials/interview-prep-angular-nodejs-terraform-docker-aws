variable "region" {
  description = "The AWS region to deploy to"
  default     = "us-east-1"
}

variable "profile" {
  description = "The AWS profile to use"
  default     = "aws-cli-user"
}

variable "environment" {
  description = "The environment for the resources (e.g., development, staging, production)"
  type = string
  default = "development"
}

variable "db_username" {
    description = "Username for interview prep postgres db"
    type = string
    sensitive = true
}

variable "db_password" {
    description = "Password for interview prep postgres db"
    type = string
    sensitive = true
}

variable "vpc_cidr" {
    description = "CIDR block for the VPC"
    type = string
    default = "10.0.0.0/16"
}

variable "subnet_a_cidr" {
    description = "CIDR block for subnet A"
    type = string
    default = "10.0.5.0/24"
}

variable "subnet_b_cidr" {
    description = "CIDR block for subnet B"
    type = string
    default = "10.0.6.0/24"
}

variable "db_subnet_a_cidr" {
    description = "CIDR block for DB subnet A"
    type = string
    default = "10.0.7.0/24"
}

variable "db_subnet_b_cidr" {
    description = "CIDR block for DB subnet B"
    type = string
    default = "10.0.8.0/24"
}

variable "availability_zone_a" {
    description = "Availability zone for subnet A"
    type = string
    default = "us-east-1a"
}

variable "availability_zone_b" {
    description = "Availability zone for subnet B"
    type = string
    default = "us-east-1b"
}

variable "vpn_ip" {
    description = "The IP address and subnet mask of the VPN, e.g., 22.146.171.139/32"
    type = string
}

variable "bastion_ami" {
    description = "The AMI ID for the bastion host"
    type = string
    default = "" # Update with the latest Amazon Linux 2 AMI ID
}

variable "bastion_instance_type" {
    description = "The instance type for the bastion host"
    type = string
}

variable "key_name" {
    description = "The name of the key pair to use for the bastion host"
    type = string
}

# variable "public_subnet_ids" {
#     description = "The IDs of the public subnets"
#     type = list(string)
# }

# variable "private_subnet_ids" {
#     description = "The IDs of the private subnets"
#     type = list(string)
# }