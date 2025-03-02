output "frontend_record_name" {
  description = "The DNS record name for the frontend service"
  value       = aws_route53_record.frontend.name
}

output "backend_record_name" {
  description = "The DNS record name for the backend service"
  value       = aws_route53_record.backend.name
}

output "frontend_cert_arn" {
  description = "The ARN of the frontend certificate"
  value       = aws_acm_certificate.frontend_cert.arn
}