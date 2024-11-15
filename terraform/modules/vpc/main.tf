resource "aws_vpc" "main" {
    cidr_block = var.vpc_cidr
    tags = {
        Name = "interview-prep-vpc"
        Environment = var.environment
    }
}

resource "aws_internet_gateway" "igw" {
    vpc_id = aws_vpc.main.id
    tags = {
        Name = "interview-prep-igw"
        Environment = var.environment
    }
}

resource "aws_nat_gateway" "nat_gw" {
    allocation_id = aws_eip.nat_eip.id
    subnet_id = var.subnet_id
    tags = {
        Name = "interview-prep-nat-gw"
        Environment = var.environment
    }
}

resource "aws_eip" "nat_eip" {
    tags = {
        Name = "interview-prep-nat-eip"
        Environment = var.environment
    }
}