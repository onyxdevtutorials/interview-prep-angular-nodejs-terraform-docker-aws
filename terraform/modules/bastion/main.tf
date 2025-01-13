resource "aws_instance" "bastion" {
  ami = var.ami
  instance_type = var.instance_type
  subnet_id = var.public_subnet_id
  vpc_security_group_ids = [var.bastion_sg_id]
  key_name = var.key_name

  tags = {
    Name = "${var.environment}-interview-prep-bastion"
    Environment = var.environment
  }
}