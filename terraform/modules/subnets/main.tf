resource "aws_subnet" "subnet_a" {
  vpc_id            = var.vpc_id
  cidr_block        = var.subnet_a_cidr
  availability_zone = var.availability_zone_a
  tags = {
    Name        = "interview-prep-subnet-a"
    Environment = var.environment
  }
}

resource "aws_subnet" "subnet_b" {
  vpc_id            = var.vpc_id
  cidr_block        = var.subnet_b_cidr
  availability_zone = var.availability_zone_b
  tags = {
    Name        = "interview-prep-subnet-b"
    Environment = var.environment
  }
}

resource "aws_subnet" "db_subnet_a" {
  vpc_id            = var.vpc_id
  cidr_block        = var.db_subnet_a_cidr
  availability_zone = var.availability_zone_a
  tags = {
    Name        = "interview-prep-db-subnet-a"
    Environment = var.environment
  }
}

resource "aws_subnet" "db_subnet_b" {
  vpc_id            = var.vpc_id
  cidr_block        = var.db_subnet_b_cidr
  availability_zone = var.availability_zone_b
  tags = {
    Name        = "interview-prep-db-subnet-b"
    Environment = var.environment
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = var.vpc_id
  tags = {
    Name        = "interview-prep-igw"
    Environment = var.environment
  }
}

resource "aws_nat_gateway" "nat_gw" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.subnet_a.id
  tags = {
    Name        = "interview-prep-nat-gw"
    Environment = var.environment
  }
}

resource "aws_eip" "nat_eip" {
  tags = {
    Name        = "interview-prep-nat-eip"
    Environment = var.environment
  }
}