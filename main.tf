provider "aws" {
  region = var.region
  profile = "aws-cli-user"
}

# Create a VPC
resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr
  tags = {
    Name = "interview-prep-vpc"
  }
}

# Create subnets
resource "aws_subnet" "subnet_a" {
  vpc_id = aws_vpc.main.id
  cidr_block = var.subnet_a_cidr
  availability_zone = var.availability_zone_a
  tags = {
    Name = "interview-prep-subnet-a"
  }
}

resource "aws_subnet" "subnet_b" {
  vpc_id = aws_vpc.main.id
  cidr_block = var.subnet_b_cidr
  availability_zone = var.availability_zone_b
  tags = {
    Name = "interview-prep-subnet-b"
  }
}

resource "aws_subnet" "db_subnet_a" {
  vpc_id = aws_vpc.main.id
  cidr_block = var.db_subnet_a_cidr
  availability_zone = var.availability_zone_a
  tags = {
    Name = "interview-prep-db-subnet-a"
  }
}

resource "aws_subnet" "db_subnet_b" {
  vpc_id = aws_vpc.main.id
  cidr_block = var.db_subnet_b_cidr
  availability_zone = var.availability_zone_b
  tags = {
    Name = "interview-prep-db-subnet-b"
  }
}

# Use existing Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name = "interview-prep-igw"
  }
}

# Create a Route Table for general-purpose subnets
resource "aws_route_table" "route_table" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
  tags = {
    Name = "interview-prep-route-table"
  }
}

# Associate Route Table with Subnets
resource "aws_route_table_association" "assoc_a" {
  subnet_id      = aws_subnet.subnet_a.id
  route_table_id = aws_route_table.route_table.id
}

resource "aws_route_table_association" "assoc_b" {
  subnet_id      = aws_subnet.subnet_b.id
  route_table_id = aws_route_table.route_table.id
}

# Security Group for RDS
resource "aws_security_group" "db_sg" {
  name = "interview-prep-db-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port = 5432
    to_port = 5432
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "interview-prep-db-sg"
  }
}

# Security Group for EC2
resource "aws_security_group" "ec2_sg" {
  name = "interview-prep-ec2-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 5432
    to_port = 5432
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "interview-prep-ec2-sg"
  }
}

# DB Subnet Group
resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "interview-prep-db-subnet-group"
  description = "Managed by Terraform"
  subnet_ids = [aws_subnet.db_subnet_a.id, aws_subnet.db_subnet_b.id]

  tags = {
    Name = "interview-prep-db-subnet-group"
  }
}

resource "aws_db_instance" "postgres" {
  identifier              = "interviewprepdbinstance"
  instance_class          = "db.t3.micro"
  allocated_storage       = 20
  engine                  = "postgres"
  engine_version          = "16.4"
  username                = var.db_username
  password                = var.db_password
  vpc_security_group_ids  = [aws_security_group.db_sg.id]
  db_subnet_group_name    = aws_db_subnet_group.db_subnet_group.name
  skip_final_snapshot     = true
  apply_immediately       = false
  tags                    = {}
}

# EC2 Instance
resource "aws_instance" "app_instance" {
  ami = "ami-0fff1b9a61dec8a5f"
  instance_type = "t2.micro"
  key_name = "OnyxKeyPair"
  network_interface {
    network_interface_id = aws_network_interface.app_network_interface.id
    device_index = 0
  }
  tags = {
    Name = "interview-prep-app-instance"
  }
}

resource "aws_network_interface" "app_network_interface" {
  subnet_id = aws_subnet.subnet_a.id
  security_groups = [aws_security_group.ec2_sg.id]
  tags = {
    Name = "interview-prep-app-network-interface"
  }
}

resource "aws_eip" "app_eip" {
  associate_with_private_ip = aws_instance.app_instance.private_ip
}

resource "aws_eip_association" "app_eip_assoc" {
  allocation_id = aws_eip.app_eip.id
  instance_id = aws_instance.app_instance.id
}

# subnets
# "SubnetId": "subnet-0198ed44e2ba16b12" interview-prep-db-subnet-a
# "SubnetId": "subnet-010340cd699a29323" interview-prep-subnet-a
# "SubnetId": "subnet-0cf4a467f95e42575" interview-prep-subnet-b
# "SubnetId": "subnet-09cab1c9483c9f659" interview-prep-db-subnet-b

# internet gateway
# "InternetGatewayId": "igw-0a4879e467270c3d0"

# ec2 instance
# "InstanceId": "i-0e6e643b1de35a967"

# network interfaces
# "NetworkInterfaceId": "eni-045b6f9b39d09e23e"

# route tables
# "RouteTableId": "rtb-0160d75bad26fd37b"

# security groups
# "GroupId": "sg-096c95794157c3733" 
# "GroupName": "default", "Description": "default VPC security group" 

# "GroupId": "sg-02ad1008f26dc5762" interview-prep-ec2-sg

# "GroupId": "sg-07420c31584bb9d36" interview-prep-db-sg
