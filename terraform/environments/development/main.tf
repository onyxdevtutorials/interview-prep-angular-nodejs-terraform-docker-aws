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

module "rds" {
  source      = "../../modules/rds"
  vpc_id      = module.vpc.vpc_id
  db_subnet_ids = [module.subnets.db_subnet_a_id, module.subnets.db_subnet_b_id]
  db_username = var.db_username
  db_password = var.db_password
  db_sg_id    = module.security_groups.db_sg_id
  environment = var.environment
}

module "ecs" {
  source                    = "../../modules/ecs"
  environment               = var.environment
  frontend_image = "interview-prep-frontend"
  backend_image = "interview-prep-backend"
  database_url = module.rds.db_instance_endpoint
  subnet_ids                = [module.subnets.subnet_a_id, module.subnets.db_subnet_b_id]
  frontend_sg_id            = module.security_groups.frontend_sg_id
  backend_sg_id             = module.security_groups.backend_sg_id
  ecs_task_execution_role   = module.iam.ecs_task_execution_role_arn
}

module "iam" {
  source      = "../../modules/iam"
  environment = var.environment
}

module "ecr" {
  source      = "../../modules/ecr"
  environment = var.environment
}