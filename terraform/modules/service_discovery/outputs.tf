output "namespace_id" {
    value = aws_service_discovery_private_dns_namespace.interview-prep-namespace.id
}

output "backend_service_arn" {
    value = aws_service_discovery_service.backend.arn
}