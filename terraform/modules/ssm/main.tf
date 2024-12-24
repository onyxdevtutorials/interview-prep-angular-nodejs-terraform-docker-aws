resource "aws_ssm_parameter" "db_host" {
    name = "/interview-prep/${var.environment}/DB_HOST"
    type = "String"
    value = "placeholder"

    lifecycle {
        ignore_changes = [value]
    }
}

resource "aws_ssm_parameter" "db_port" {
    name = "/interview-prep/${var.environment}/DB_PORT"
    type = "String"
    value = "placeholder"

    lifecycle {
        ignore_changes = [value]
    }
}

resource "aws_ssm_parameter" "db_name" {
    name = "/interview-prep/${var.environment}/DB_NAME"
    type = "String"
    value = "placeholder"

    lifecycle {
        ignore_changes = [value]
    }
}

resource "aws_ssm_parameter" "db_user" {
    name = "/interview-prep/${var.environment}/DB_USERNAME"
    type = "String"
    value = "placeholder"

    lifecycle {
        ignore_changes = [value]
    }
}

resource "aws_ssm_parameter" "db_pass" {
    name = "/interview-prep/${var.environment}/DB_PASSWORD"
    type = "SecureString"
    value = "placeholder"

    lifecycle {
        ignore_changes = [value]
    }
}