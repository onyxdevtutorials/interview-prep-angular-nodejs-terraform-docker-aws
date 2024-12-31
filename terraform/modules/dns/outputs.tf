output "frontend_record_name" {
  description = "The DNS record name for the frontend service"
  value       = aws_route53_record.frontend.name
}

output "backend_record_name" {
  description = "The DNS record name for the backend service"
  value       = aws_route53_record.backend.name
}