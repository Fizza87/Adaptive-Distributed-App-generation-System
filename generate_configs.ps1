# ADAGDS - Configuration Generator (Windows PowerShell)
# Generates 15 sample application configuration files

# Create configs directory if it doesn't exist
if (-not (Test-Path "configs")) {
    New-Item -ItemType Directory -Path "configs" | Out-Null
    Write-Host "Created configs directory"
}

# Configuration templates
$configs = @(
    @{
        name = "app1.json"
        content = @{
            appName = "app1"
            appId = "app-001-user-service"
            version = "1.0.0"
            environment = "production"
            port = 3001
            features = @("auth", "api")
            description = "User authentication and management service"
        }
    },
    @{
        name = "app2.json"
        content = @{
            appName = "app2"
            appId = "app-002-analytics-engine"
            version = "1.0.0"
            environment = "production"
            port = 3002
            features = @("dashboard", "api")
            description = "Real-time analytics and metrics service"
        }
    },
    @{
        name = "app3.json"
        content = @{
            appName = "app3"
            appId = "app-003-payment-gateway"
            version = "1.0.0"
            environment = "production"
            port = 3003
            features = @("api")
            description = "Payment processing and transaction management"
        }
    },
    @{
        name = "app4.json"
        content = @{
            appName = "app4"
            appId = "app-004-notification-hub"
            version = "1.0.0"
            environment = "production"
            port = 3004
            features = @("api")
            description = "Push notifications and message delivery service"
        }
    },
    @{
        name = "app5.json"
        content = @{
            appName = "app5"
            appId = "app-005-content-management"
            version = "1.0.0"
            environment = "production"
            port = 3005
            features = @("auth", "dashboard")
            description = "Content management and publishing platform"
        }
    },
    @{
        name = "app6.json"
        content = @{
            appName = "app6"
            appId = "app-006-file-storage"
            version = "1.0.0"
            environment = "production"
            port = 3006
            features = @("api")
            description = "Cloud file storage and management service"
        }
    },
    @{
        name = "app7.json"
        content = @{
            appName = "app7"
            appId = "app-007-reporting-tool"
            version = "1.0.0"
            environment = "production"
            port = 3007
            features = @("dashboard", "api")
            description = "Advanced reporting and data visualization tool"
        }
    },
    @{
        name = "app8.json"
        content = @{
            appName = "app8"
            appId = "app-008-search-service"
            version = "1.0.0"
            environment = "production"
            port = 3008
            features = @("api")
            description = "Full-text search and indexing service"
        }
    },
    @{
        name = "app9.json"
        content = @{
            appName = "app9"
            appId = "app-009-workflow-engine"
            version = "1.0.0"
            environment = "production"
            port = 3009
            features = @("auth", "dashboard", "api")
            description = "Workflow automation and task orchestration"
        }
    },
    @{
        name = "app10.json"
        content = @{
            appName = "app10"
            appId = "app-010-monitoring-service"
            version = "1.0.0"
            environment = "production"
            port = 3010
            features = @("dashboard", "api")
            description = "System monitoring and health check service"
        }
    },
    @{
        name = "app11.json"
        content = @{
            appName = "app11"
            appId = "app-011-api-gateway"
            version = "1.0.0"
            environment = "production"
            port = 3011
            features = @("auth", "api")
            description = "API gateway and request routing service"
        }
    },
    @{
        name = "app12.json"
        content = @{
            appName = "app12"
            appId = "app-012-cache-service"
            version = "1.0.0"
            environment = "production"
            port = 3012
            features = @("api")
            description = "Distributed caching and session management"
        }
    },
    @{
        name = "app13.json"
        content = @{
            appName = "app13"
            appId = "app-013-queue-processor"
            version = "1.0.0"
            environment = "production"
            port = 3013
            features = @("api")
            description = "Message queue and background job processor"
        }
    },
    @{
        name = "app14.json"
        content = @{
            appName = "app14"
            appId = "app-014-ml-inference"
            version = "1.0.0"
            environment = "production"
            port = 3014
            features = @("api")
            description = "Machine learning model inference service"
        }
    },
    @{
        name = "app15.json"
        content = @{
            appName = "app15"
            appId = "app-015-backup-service"
            version = "1.0.0"
            environment = "production"
            port = 3015
            features = @("api")
            description = "Data backup and disaster recovery service"
        }
    }
)

# Generate configuration files
foreach ($config in $configs) {
    $filePath = Join-Path "configs" $config.name
    $jsonContent = $config.content | ConvertTo-Json
    Set-Content -Path $filePath -Value $jsonContent -Encoding UTF8
    Write-Host "✓ Generated $($config.name)"
}

Write-Host "`nGenerated 15 application configuration files in configs\ directory"
Write-Host "Files created:"
Get-ChildItem -Path "configs" -Filter "*.json" | ForEach-Object { Write-Host "  - $($_.Name)" }