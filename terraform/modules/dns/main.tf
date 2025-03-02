resource "aws_route53_record" "frontend" {
  zone_id = var.zone_id
  name    = var.frontend_record_name
  type    = "A"

  alias {
    name                   = var.lb_dns_name
    zone_id                = var.lb_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "backend" {
  zone_id = var.zone_id
  name    = var.backend_record_name
  type    = "A"

  alias {
    name = var.custom_domain_name
    zone_id = var.custom_domain_zone_id
    evaluate_target_health = false
  }
}

resource "aws_acm_certificate" "frontend_cert" {
  domain_name       = var.frontend_record_name
  validation_method = "DNS"

  tags = {
    Name        = "${var.environment}-frontend-cert"
    Environment = var.environment
  }
}

resource "aws_route53_record" "frontend_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.frontend_cert.domain_validation_options : dvo.domain_name => {
      name         = dvo.resource_record_name
      type        = dvo.resource_record_type
      record  = dvo.resource_record_value
    }
  }

  zone_id = var.zone_id
  name = each.value.name
  type = each.value.type
  records = [each.value.record]
  ttl = 60

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate_validation" "frontend_cert_validation" {
  certificate_arn         = aws_acm_certificate.frontend_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.frontend_cert_validation : record.fqdn]
}

