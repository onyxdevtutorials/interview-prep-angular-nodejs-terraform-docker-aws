provider "aws" {
    region = var.region
    profile = var.profile
}

module "vpc" {
    source = "../../modules/vpc"
    vpc_cidr = var.vpc_cidr
    public_subnet_a_id = module.subnets.public_subnet_a_id
    public_subnet_b_id = module.subnets.public_subnet_b_id
    private_subnet_a_id = module.subnets.private_subnet_a_id
    private_subnet_b_id = module.subnets.private_subnet_b_id
    environment = var.environment
}

module "subnets" {
    source = "../../modules/subnets"
    vpc_id = module.vpc.vpc_id
    public_subnet_a_cidr = var.public_subnet_a_cidr
    public_subnet_b_cidr = var.public_subnet_b_cidr
    private_subnet_a_cidr = var.private_subnet_a_cidr
    private_subnet_b_cidr = var.private_subnet_b_cidr
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
  private_subnet_ids = [module.subnets.private_subnet_a_id, module.subnets.private_subnet_b_id]
  db_username = var.db_username
  db_password = var.db_password
  db_sg_id    = module.security_groups.db_sg_id
  environment = var.environment
}

module "service_discovery" {
  source      = "../../modules/service_discovery"
  environment = var.environment
  vpc_id      = module.vpc.vpc_id
}

module "ecs" {
  source                    = "../../modules/ecs"
  environment               = var.environment
  region                    = var.region
  frontend_image = "interview-prep-frontend"
  frontend_repository_url = module.ecr.frontend_repository_url
  backend_image = "interview-prep-backend"
  backend_repository_url = module.ecr.backend_repository_url
  database_url = module.rds.db_instance_endpoint
  public_subnet_ids         = [module.subnets.public_subnet_a_id, module.subnets.public_subnet_b_id]
  private_subnet_ids = [module.subnets.private_subnet_a_id, module.subnets.private_subnet_b_id]
  frontend_sg_id            = module.security_groups.frontend_sg_id
  backend_sg_id             = module.security_groups.backend_sg_id
  ecs_task_execution_role   = module.iam.ecs_task_execution_role_arn
  ecs_task_role_arn = module.iam.ecs_task_role_arn
  service_discovery_namespace_id = module.service_discovery.namespace_id
  backend_service_arn = module.service_discovery.backend_service_arn
  db_username = var.db_username
  db_password = var.db_password
}

module "iam" {
  source      = "../../modules/iam"
  environment = var.environment
  account_id = var.account_id
}

module "ecr" {
  source      = "../../modules/ecr"
  environment = var.environment
}

module "bastion" {
  source = "../../modules/bastion"
  vpc_id = module.vpc.vpc_id
  public_subnet_id = module.subnets.public_subnet_a_id
  bastion_sg_id = module.security_groups.bastion_sg_id
  ami = var.bastion_ami
  instance_type = var.bastion_instance_type
  key_name = var.key_name
  environment = var.environment
}

module "ssm_parameters" {
  source = "../../modules/ssm"
  environment = var.environment
  db_host = module.rds.db_instance_endpoint
  db_port = module.rds.db_instance_port
  db_name = module.rds.db_instance_name
  db_user = var.db_username
  db_pass = var.db_password
}

module "lambda_migrate" {
  source = "../../modules/lambda"
  environment = var.environment
  function_name = "${var.environment}-interview-prep-migrate"
  handler = "index.handler"
  runtime = "nodejs20.x"
  lambda_package = var.lambda_package_migrate
  lambda_subnet_ids = [module.subnets.private_subnet_a_id, module.subnets.private_subnet_b_id]
  lambda_sg_id = module.security_groups.lambda_sg_id
  db_host_param = module.ssm_parameters.db_host_param
  db_port_param = module.ssm_parameters.db_port_param
  db_name_param = module.ssm_parameters.db_name_param
  db_user_param = module.ssm_parameters.db_user_param
  db_pass_param = module.ssm_parameters.db_pass_param
  lambda_exec_role_arn = module.iam.lambda_exec_role_arn
}