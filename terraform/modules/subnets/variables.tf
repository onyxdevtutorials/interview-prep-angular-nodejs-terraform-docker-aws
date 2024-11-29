variable "vpc_id" {
  description = "The ID of the VPC"
  type = string
}

variable "subnet_a_cidr" {
  description = "CIDR block for subnet A"
  type = string
}

variable "subnet_b_cidr" {
  description = "CIDR block for subnet B"
  type = string
}

variable "db_subnet_a_cidr" {
  description = "CIDR block for DB subnet A"
  type = string
}

variable "db_subnet_b_cidr" {
  description = "CIDR block for DB subnet B"
  type = string
}

variable "availability_zone_a" {
  description = "Availability zone for subnet A"
  type = string
}

variable "availability_zone_b" {
  description = "Availability zone for subnet B"
  type = string
}

variable "environment" {
  description = "The environment for the resources (e.g., development, staging, production)"
  type = string
}