resource "aws_ecr_repository" "frontend" {
  name = "${var.environment}-frontend"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }

    tags = {
        Name = "${var.environment}-frontend"
        Environment = var.environment
    }
}

resource "aws_ecr_repository" "backend" {
  name = "${var.environment}-backend"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }

    tags = {
        Name = "${var.environment}-backend"
        Environment = var.environment
    }
}