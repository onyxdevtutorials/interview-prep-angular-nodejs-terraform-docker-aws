output "vpc_id" {
    description = "The ID of the VPC"
    value = aws_vpc.interview_prep_vpc.id
}

output "vpc_cidr_block" {
    description = "The CIDR block of the VPC"
    value = aws_vpc.interview_prep_vpc.cidr_block
}

output "internet_gateway_id" {
    description = "The ID of the Internet Gateway"
    value = aws_internet_gateway.igw.id
}