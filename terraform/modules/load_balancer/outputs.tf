output "lb_arn" {
    description = "The ARN of the load balancer"
    value       = aws_lb.this.arn
}

output "lb_dns_name" {
    description = "The DNS name of the load balancer"
    value       = aws_lb.this.dns_name
}

output "frontend_target_group_arn" {
    description = "The ARN of the frontend target group"
    value       = aws_lb_target_group.frontend.arn
}

output "backend_target_group_arn" {
    description = "The ARN of the backend target group"
    value       = aws_lb_target_group.backend.arn
}

output "lb_zone_id" {
    description = "The zone ID of the load balancer"
    value       = aws_lb.this.zone_id
}