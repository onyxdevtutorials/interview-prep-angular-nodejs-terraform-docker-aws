variable "environment" {
  description = "The environment to deploy to"
  type        = string
}

variable "db_host" {
  description = "The database host"
  type        = string
}

variable "db_port" {
  description = "The database port"
  type        = number
}

variable "db_name" {
  description = "The database name"
  type        = string
}

variable "db_user" {
  description = "The database user"
  type        = string
}

variable "db_pass" {
  description = "The database password"
  type        = string
}
