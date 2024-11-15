provider "aws" {
    region = var.region
    profile = var.profile
}

module "vpc" {
    source = "../../modules/vpc"
    vpc_cidr = var.vpc_cidr
    subnet_id = module.subnets.subnet_a_id
    environment = var.environment
}

module "subnets" {
    source = "../../modules/subnets"
    vpc_id = module.vpc.vpc_id
    subnet_a_cidr = var.subnet_a_cidr
    subnet_b_cidr = var.subnet_b_cidr
    db_subnet_a_cidr = var.db_subnet_a_cidr
    db_subnet_b_cidr = var.db_subnet_b_cidr
    availability_zone_a = var.availability_zone_a
    availability_zone_b = var.availability_zone_b
    environment = var.environment
}