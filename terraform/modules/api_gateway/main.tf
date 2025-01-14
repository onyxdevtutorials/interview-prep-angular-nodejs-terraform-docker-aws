resource "aws_api_gateway_rest_api" "api" {
  name        = "${var.environment}-interview-prep-api"
  description = "API Gateway for Interview Prep ${var.environment} environment"
}

resource "aws_api_gateway_resource" "proxy" {
    rest_api_id = aws_api_gateway_rest_api.api.id
    parent_id   = aws_api_gateway_rest_api.api.root_resource_id
    path_part   = "{proxy+}"

    depends_on = [ aws_api_gateway_rest_api.api ]
}

resource "aws_api_gateway_method" "proxy_method" {
    rest_api_id = aws_api_gateway_rest_api.api.id
    resource_id = aws_api_gateway_resource.proxy.id
    http_method = "ANY"
    authorization = "NONE"
    api_key_required = false
    request_parameters = {
      "method.request.path.proxy" = true
    }
}

resource "aws_api_gateway_method" "proxy_options" {
    rest_api_id = aws_api_gateway_rest_api.api.id
    resource_id = aws_api_gateway_resource.proxy.id
    http_method = "OPTIONS"
    authorization = "NONE"
    api_key_required = false
}

resource "aws_api_gateway_integration" "proxy_integration" {
    rest_api_id = aws_api_gateway_rest_api.api.id
    resource_id = aws_api_gateway_resource.proxy.id
    http_method = aws_api_gateway_method.proxy_method.http_method
    type = "HTTP_PROXY"
    integration_http_method = "ANY"
    uri = "http://${var.lb_dns_name}:3000/{proxy}"
    request_parameters = {
      "integration.request.path.proxy" = "method.request.path.proxy"
    }
    timeout_milliseconds = 29000
}

resource "aws_api_gateway_integration" "proxy_options_integration" {
    rest_api_id = aws_api_gateway_rest_api.api.id
    resource_id = aws_api_gateway_resource.proxy.id
    http_method = aws_api_gateway_method.proxy_options.http_method
    type = "MOCK"
    request_templates = {
      "application/json" = "{\"statusCode\": 200}"
    }
}

resource "aws_api_gateway_integration_response" "proxy_options_integration_response" {
    rest_api_id = aws_api_gateway_rest_api.api.id
    resource_id = aws_api_gateway_resource.proxy.id
    http_method = aws_api_gateway_method.proxy_options.http_method
    status_code = "200"
    response_parameters = {
        "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'"
        "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,PUT,POST,DELETE,PATCH'"
        "method.response.header.Access-Control-Allow-Origin"  = "'*'"
    }
}

resource "aws_api_gateway_method_response" "proxy_options_response" {
    rest_api_id = aws_api_gateway_rest_api.api.id
    resource_id = aws_api_gateway_resource.proxy.id
    http_method = aws_api_gateway_method.proxy_options.http_method
    status_code = "200"
    response_parameters = {
        "method.response.header.Access-Control-Allow-Headers" = true
        "method.response.header.Access-Control-Allow-Methods" = true
        "method.response.header.Access-Control-Allow-Origin"  = true
    }
}

resource "aws_api_gateway_deployment" "api_deployment" {
    depends_on = [
      aws_api_gateway_integration.proxy_integration,
      aws_api_gateway_integration.proxy_options_integration,
      aws_api_gateway_integration_response.proxy_options_integration_response,
      aws_api_gateway_method_response.proxy_options_response
    ]
    rest_api_id = aws_api_gateway_rest_api.api.id

    triggers = {
      redeployment = "${timestamp()}"
    }
}

resource "aws_api_gateway_stage" "api_stage" {
    deployment_id = aws_api_gateway_deployment.api_deployment.id
    rest_api_id = aws_api_gateway_rest_api.api.id
    stage_name = "dev"

    access_log_settings {
      destination_arn = aws_cloudwatch_log_group.api_gateway_log_group.arn
      format = "$context.requestId $context.identity.sourceIp $context.identity.userAgent $context.requestTime $context.httpMethod $context.resourcePath $context.status $context.protocol $context.responseLength"
    }
}

resource "aws_api_gateway_method_settings" "api_method_settings" {
    rest_api_id = aws_api_gateway_rest_api.api.id
    stage_name = aws_api_gateway_stage.api_stage.stage_name
    method_path = "*/*"
    settings {
        metrics_enabled = true
        logging_level = "INFO"
        data_trace_enabled = true
    }
}

resource "aws_cloudwatch_log_group" "api_gateway_log_group" {
    name = "/aws/api-gateway/interview-prep/${aws_api_gateway_rest_api.api.id}"
    retention_in_days = 7
}

resource "aws_iam_role" "api_gateway_cloudwatch_role" {
    name = "${var.environment}-interview-prep-api-gateway-cloudwatch-role"
    assume_role_policy = jsonencode({
        Version = "2012-10-17",
        Statement = [
            {
                Effect = "Allow",
                Principal = {
                    Service = "apigateway.amazonaws.com"
                },
                Action = "sts:AssumeRole"
            }
        ]
    })
}

resource "aws_iam_policy" "api_gateway_cloudwatch_policy" {
    name = "${var.environment}-interview-prep-api-gateway-cloudwatch-policy"
    description = "Policy for API Gateway to write logs to CloudWatch"
    policy = jsonencode({
        Version = "2012-10-17",
        Statement = [
            {
                Effect = "Allow",
                Action = [
                    "logs:CreateLogGroup",
                    "logs:CreateLogStream",
                    "logs:PutLogEvents"
                ],
                Resource = "*"
            }
        ]
    })
}

resource "aws_iam_role_policy_attachment" "api_gateway_cloudwatch_policy_attachment" {
    policy_arn = aws_iam_policy.api_gateway_cloudwatch_policy.arn
    role = aws_iam_role.api_gateway_cloudwatch_role.name
}

resource "aws_api_gateway_domain_name" "custom_domain" {
  domain_name = "api.dev.interviewprep.onyxdevtutorials.com"

  endpoint_configuration {
    types = ["EDGE"]
  }

  certificate_arn = var.certificate_arn
}

resource "aws_api_gateway_base_path_mapping" "custom_domain_mapping" {
  api_id = aws_api_gateway_rest_api.api.id
  stage_name = aws_api_gateway_stage.api_stage.stage_name
  domain_name = aws_api_gateway_domain_name.custom_domain.domain_name
}