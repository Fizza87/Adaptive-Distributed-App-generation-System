# Adaptive Distributed Application Generation System (ADAGS)

An end-to-end distributed orchestration framework designed to dynamically generate, configure, and manage multi-tenant web application instances based on user-defined configurations.

---

##  Project Overview:
ADAGS is a high-performance distributed system built to automate the lifecycle of dynamic application generation. Through a centralized dashboard, users can define application metadata such as app names, features, APIs, authentication modules, and custom styling themes.  

The backend distributed engine processes these configurations and automatically generates completely isolated frontend/backend application instances while managing them through containerized environments.

---

##  System Architecture

The system follows a resilient and scalable **Master-Worker Architecture** designed for parallel processing and efficient workload distribution.

### Components

### 1. Central Dashboard (Frontend)
Provides an interface for users to:
- Create application configurations
- Select features
- Apply themes and customization
- Manage generated applications

### 2. Generator Server (`generator-server.js`)
Acts as the orchestration layer that:
- Receives configuration payloads
- Validates requests
- Schedules distributed generation tasks

### 3. Master Process (`master.js`)
Responsible for:
- Worker allocation
- Cluster coordination
- Process monitoring
- Task distribution

### 4. Worker Processes (`worker.js`)
Independent execution units that:
- Generate application structures
- Inject configurations dynamically
- Build isolated application instances
- Handle asynchronous generation tasks

### 5. Config Management (`configs/`)
Maintains isolated tenant configurations to ensure:
- Multi-tenant separation
- Safe concurrent generation
- Dynamic template injection

---

##  Technologies & Tools

### Backend
- Node.js
- Express.js

### Distributed Computing
- Node.js Cluster Module
- Master-Worker Architecture

### Containerization
- Docker
- Docker Compose

### Automation
- PowerShell Scripts
- Bash Scripts

### Frontend
- HTML5
- CSS3
- JavaScript

---

##  Distributed System Concepts Used

This project applies core concepts of **Parallel and Distributed Computing (PDC)** to optimize dynamic application generation.

### Parallel Task Distribution
The master node distributes generation tasks across multiple worker processes for concurrent execution.

### Asynchronous Processing
Heavy file operations and build generation tasks are executed asynchronously to avoid blocking the main execution flow.

### Fault Isolation
Failure inside one worker process does not affect:
- Other active workers
- Running applications
- The main orchestration server

### Multi-Tenant Isolation
Each generated application is maintained independently to prevent configuration conflicts and race conditions.

### Scalability
Additional worker nodes can be added dynamically to improve generation throughput and system performance.

---

## Project Structure

```bash
.
├── configs/
├── dashboard/
├── output/
├── generator-server.js
├── master.js
├── worker.js
├── orchestrate.sh
├── generate_configs.ps1
├── docker_compose.yml
├── Dockerfile
└── Dockerfile.worker
```

---

##  How to Run

## Prerequisites

Install either:
- Node.js
OR
- Docker & Docker Compose

---

## Option 1: Run with Docker (Recommended)

```bash
docker-compose up --build
```

This launches:
- Generator server
- Master process
- Worker nodes
- Distributed orchestration environment

---

## Option 2: Run Locally

### Install Dependencies

```bash
npm install
```

### Start the System

```bash
node master.js
```

OR

```bash
node generator-server.js
```

---

## Features

- Dynamic application generation
- Distributed worker-based execution
- Multi-tenant architecture
- Dockerized deployment
- Automated orchestration
- Theme-based customization
- Config-driven app generation
- Fault-tolerant processing
- Parallel build execution

---

##  Academic Context

This project was developed as part of a **Parallel and Distributed Computing (PDC)** implementation to demonstrate practical concepts including:

- Distributed task scheduling
- Parallel execution
- Cluster-based workload management
- Fault isolation
- Multi-process orchestration
- Containerized distributed systems

---
## Author

Developed by Fizza Abdul Razzaq

---
