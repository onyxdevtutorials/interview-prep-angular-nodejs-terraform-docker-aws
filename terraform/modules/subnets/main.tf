resource "aws_subnet" "public_subnet_a" {
  vpc_id            = var.vpc_id
  cidr_block        = var.public_subnet_a_cidr
  availability_zone = var.availability_zone_a
  map_public_ip_on_launch = false
  tags = {
    Name        = "interview-prep-public-subnet-a"
    Environment = var.environment
  }
}

resource "aws_subnet" "public_subnet_b" {
  vpc_id            = var.vpc_id
  cidr_block        = var.public_subnet_b_cidr
  availability_zone = var.availability_zone_b
  map_public_ip_on_launch = false
  tags = {
    Name        = "interview-prep-public-subnet-b"
    Environment = var.environment
  }
}

resource "aws_subnet" "private_subnet_a" {
  vpc_id            = var.vpc_id
  cidr_block        = var.private_subnet_a_cidr
  availability_zone = var.availability_zone_a
  tags = {
    Name        = "interview-prep-private-subnet-a"
    Environment = var.environment
  }
}

resource "aws_subnet" "private_subnet_b" {
  vpc_id            = var.vpc_id
  cidr_block        = var.private_subnet_b_cidr
  availability_zone = var.availability_zone_b
  tags = {
    Name        = "interview-prep-private-subnet-b"
    Environment = var.environment
  }
}
