resource "aws_service_discovery_private_dns_namespace" "interview-prep-namespace" {
    name = "${var.environment}.interview-prep.local"
    vpc = var.vpc_id
    description = "Private DNS namespace for Interview Prep ${var.environment}"
}

resource "aws_service_discovery_service" "backend" {
    name = "backend"
    dns_config {
        namespace_id = aws_service_discovery_private_dns_namespace.interview-prep-namespace.id
        dns_records {
            ttl = 10
            type = "A"
        }
    }
    health_check_custom_config {
        failure_threshold = 1
    }
}