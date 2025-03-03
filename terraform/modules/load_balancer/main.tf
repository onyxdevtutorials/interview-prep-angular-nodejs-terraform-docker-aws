# Create an Application Load Balancer (ALB) to route incoming traffic to the frontend and backend services.
resource "aws_lb" "this" {
  name               = "${var.environment}-interview-prep-lb"
  internal           = false # Set to false to create an internet-facing load balancer
  load_balancer_type = "application" # Other types include network and gateway
  security_groups    = var.security_groups
  subnets            = var.public_subnet_ids

  enable_deletion_protection = false # Set to true to enable accidental deletion protection
  enable_http2               = false # Set to true to enable HTTP/2
  enable_cross_zone_load_balancing = true # Set to true to enable cross-zone load balancing. This distributes incoming requests evenly across all registered targets in all enabled Availability Zones.

  tags = {
    Name        = "${var.environment}-interview-prep-lb"
    Environment = var.environment
  }
}

resource "aws_lb_target_group" "frontend" {
  name     = "${var.environment}-ip-frontend-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id
  target_type = "ip" # Other types include instance and lambda

  health_check {
    path                = var.frontend_health_check_path
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    matcher = "200-299"
  }

  tags = {
    Name        = "${var.environment}-ip-frontend-tg"
    Environment = var.environment
  }
}

resource "aws_lb_target_group" "backend" {
  name     = "${var.environment}-ip-backend-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = var.vpc_id
  target_type = "ip"

  health_check {
    path                = var.backend_health_check_path
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    matcher = "200-299"
  }

  tags = {
    Name        = "${var.environment}-ip-backend-tg"
    Environment = var.environment
  }
}

resource "aws_lb_listener" "https_frontend" {
  load_balancer_arn = aws_lb.this.arn
  port              = 443
  protocol          = "HTTPS"
  # ELBSecurityPolicy-2016-08 is a security policy that includes a set of SSL/TLS protocols and ciphers that are considered secure as of August 2016. It is designed to provide a balance between compatibility with older clients and security.
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.frontend_cert_arn # Refer to the DNS module to see how the certificate ARN is passed to the load balancer.

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

resource "aws_lb_listener" "http_frontend" {
  load_balancer_arn = aws_lb.this.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_listener" "http_backend" {
  load_balancer_arn = aws_lb.this.arn
  port              = 3000
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn # Refer to the ECS module to see how the target group ARN is passed to the ECS service.
  }
}