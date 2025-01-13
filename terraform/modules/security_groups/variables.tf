variable "vpc_id" {
    description = "The ID of the VPC"
    type = string
}

variable "environment" {
    description = "The environment for the resources (e.g., development, staging, production)"
    type = string
}

variable "vpn_ip" {
    description = "The IP address of the VPN"
    type = string
}