resource "aws_ecr_repository" "frontend" {
  name = "interview-prep-frontend"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }

    tags = {
        Name = "interview-prep-frontend"
        Environment = var.environment
    }
}

resource "aws_ecr_repository" "backend" {
  name = "interview-prep-backend"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }

    tags = {
        Name = "interview-prep-backend"
        Environment = var.environment
    }
}