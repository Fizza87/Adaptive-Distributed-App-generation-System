#!/bin/bash

# Create configs directory
mkdir -p configs

# Generate 15 configuration files
cat > configs/app1.json << 'EOF'
{
  "appName": "app1",
  "appId": "app-001-user-service",
  "version": "1.0.0",
  "environment": "production",
  "port": 3001,
  "features": ["auth", "api"],
  "description": "User authentication and management service"
}
EOF

cat > configs/app2.json << 'EOF'
{
  "appName": "app2",
  "appId": "app-002-analytics-engine",
  "version": "1.0.0",
  "environment": "production",
  "port": 3002,
  "features": ["dashboard", "api"],
  "description": "Real-time analytics and metrics service"
}
EOF

cat > configs/app3.json << 'EOF'
{
  "appName": "app3",
  "appId": "app-003-payment-gateway",
  "version": "1.0.0",
  "environment": "production",
  "port": 3003,
  "features": ["api"],
  "description": "Payment processing and transaction management"
}
EOF

cat > configs/app4.json << 'EOF'
{
  "appName": "app4",
  "appId": "app-004-notification-hub",
  "version": "1.0.0",
  "environment": "production",
  "port": 3004,
  "features": ["api"],
  "description": "Push notifications and message delivery service"
}
EOF

cat > configs/app5.json << 'EOF'
{
  "appName": "app5",
  "appId": "app-005-content-management",
  "version": "1.0.0",
  "environment": "production",
  "port": 3005,
  "features": ["auth", "dashboard"],
  "description": "Content management and publishing platform"
}
EOF

cat > configs/app6.json << 'EOF'
{
  "appName": "app6",
  "appId": "app-006-file-storage",
  "version": "1.0.0",
  "environment": "production",
  "port": 3006,
  "features": ["api"],
  "description": "Cloud file storage and management service"
}
EOF

cat > configs/app7.json << 'EOF'
{
  "appName": "app7",
  "appId": "app-007-reporting-tool",
  "version": "1.0.0",
  "environment": "production",
  "port": 3007,
  "features": ["dashboard", "api"],
  "description": "Advanced reporting and data visualization tool"
}
EOF

cat > configs/app8.json << 'EOF'
{
  "appName": "app8",
  "appId": "app-008-search-service",
  "version": "1.0.0",
  "environment": "production",
  "port": 3008,
  "features": ["api"],
  "description": "Full-text search and indexing service"
}
EOF

cat > configs/app9.json << 'EOF'
{
  "appName": "app9",
  "appId": "app-009-workflow-engine",
  "version": "1.0.0",
  "environment": "production",
  "port": 3009,
  "features": ["auth", "dashboard", "api"],
  "description": "Workflow automation and task orchestration"
}
EOF

cat > configs/app10.json << 'EOF'
{
  "appName": "app10",
  "appId": "app-010-monitoring-service",
  "version": "1.0.0",
  "environment": "production",
  "port": 3010,
  "features": ["dashboard", "api"],
  "description": "System monitoring and health check service"
}
EOF

cat > configs/app11.json << 'EOF'
{
  "appName": "app11",
  "appId": "app-011-api-gateway",
  "version": "1.0.0",
  "environment": "production",
  "port": 3011,
  "features": ["auth", "api"],
  "description": "API gateway and request routing service"
}
EOF

cat > configs/app12.json << 'EOF'
{
  "appName": "app12",
  "appId": "app-012-cache-service",
  "version": "1.0.0",
  "environment": "production",
  "port": 3012,
  "features": ["api"],
  "description": "Distributed caching and session management"
}
EOF

cat > configs/app13.json << 'EOF'
{
  "appName": "app13",
  "appId": "app-013-queue-processor",
  "version": "1.0.0",
  "environment": "production",
  "port": 3013,
  "features": ["api"],
  "description": "Message queue and background job processor"
}
EOF

cat > configs/app14.json << 'EOF'
{
  "appName": "app14",
  "appId": "app-014-ml-inference",
  "version": "1.0.0",
  "environment": "production",
  "port": 3014,
  "features": ["api"],
  "description": "Machine learning model inference service"
}
EOF

cat > configs/app15.json << 'EOF'
{
  "appName": "app15",
  "appId": "app-015-backup-service",
  "version": "1.0.0",
  "environment": "production",
  "port": 3015,
  "features": ["api"],
  "description": "Data backup and disaster recovery service"
}
EOF

echo "Generated 15 application configuration files in configs/ directory"
ls -la configs/