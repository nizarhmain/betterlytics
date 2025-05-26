#!/bin/bash
set -e

# Create a user for backend ingress
clickhouse-client --query="CREATE USER IF NOT EXISTS ${CLICKHOUSE_BACKEND_USER} IDENTIFIED BY '${CLICKHOUSE_BACKEND_PASSWORD}';"

# Create a user for dashboard egress
clickhouse-client --query="CREATE USER IF NOT EXISTS ${CLICKHOUSE_DASHBOARD_USER} IDENTIFIED BY '${CLICKHOUSE_DASHBOARD_PASSWORD}';"

# Create roles
clickhouse-client --query="CREATE ROLE ingress_role;"
clickhouse-client --query="CREATE ROLE egress_role;"

# Grant privileges to roles
clickhouse-client --query="GRANT INSERT ON analytics.* TO ingress_role;"
clickhouse-client --query="GRANT SELECT ON analytics.* TO egress_role;"

# Assign roles to users
clickhouse-client --query="GRANT ingress_role TO ${CLICKHOUSE_BACKEND_USER};"
clickhouse-client --query="GRANT egress_role TO ${CLICKHOUSE_DASHBOARD_USER};"
