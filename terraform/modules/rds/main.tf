resource "aws_db_subnet_group" "postgres" {
    name       = "interview-prep-db-subnet-group"
    description = "Managed by Terraform"
    subnet_ids = var.db_subnet_ids
    tags = {
        Name        = "interview-prep-db-subnet-group"
        Environment = var.environment
    }
}

resource "aws_db_instance" "postgres" {
    identifier = "${var.environment}-interview-prep-db"
    instance_class       = "db.t3.micro"
    allocated_storage    = 20
    engine               = "postgres"
    engine_version       = "16.4"
    username             = var.db_username
    password             = var.db_password
    vpc_security_group_ids = [var.db_sg_id]
    db_subnet_group_name = aws_db_subnet_group.postgres.name
    skip_final_snapshot = true
    apply_immediately = false
    tags = {
        Name        = "${var.environment}-interview-prep-db"
        Environment = var.environment
    }

    enabled_cloudwatch_logs_exports = ["postgresql"]
}