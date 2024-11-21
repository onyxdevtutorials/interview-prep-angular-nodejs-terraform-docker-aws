provider "aws" {
    region = var.region
    profile = var.profile
}

module "vpc" {
    source = "../../modules/vpc"
    vpc_cidr = var.vpc_cidr
    public_subnet_a_id = module.subnets.subnet_a_id
    public_subnet_b_id = module.subnets.subnet_b_id
    private_subnet_a_id = module.subnets.db_subnet_a_id
    private_subnet_b_id = module.subnets.db_subnet_b_id
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

module "security_groups" {
    source = "../../modules/security_groups"
    vpc_id = module.vpc.vpc_id
    environment = var.environment
    vpn_ip = var.vpn_ip
}