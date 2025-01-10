output "api_invoke_url" {
  value = "https://${aws_api_gateway_rest_api.api.id}.execute-api.${var.region}.amazonaws.com/dev"
}

# output "api_key_id" {
#   value = aws_api_gateway_api_key.api_key.id
# }
