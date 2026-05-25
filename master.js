#!/usr/bin/env node

/**
 * ADAGDS - Master Node (Coordinator)
 * One command → 5 fully independent apps generated in parallel
 * Each app: unique purpose, data, UI, environment, port
 */

const os = require('os');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const EventEmitter = require('events');

// ─── System Resource Analyzer ─────────────────────────────────────────────────
class SystemResourceAnalyzer {
  analyze() {
    const cpus  = os.cpus();
    const total = os.totalmem();
    const free  = os.freemem();
    return {
      timestamp: new Date().toISOString(),
      cpu: {
        count:    cpus.length,
        model:    cpus[0].model,
        speedMHz: cpus[0].speed,
      },
      memory: {
        totalGB:      (total / 1024 ** 3).toFixed(2),
        freeGB:       (free  / 1024 ** 3).toFixed(2),
        usagePercent: (((total - free) / total) * 100).toFixed(2),
      },
      gpu:      { detected: this._detectGPU() },
      platform: os.platform(),
      hostname: os.hostname(),
    };
  }

  _detectGPU() {
    try {
      require('child_process').execSync('nvidia-smi', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }
}

// ─── Adaptive Workload Decision Engine ────────────────────────────────────────
class AdaptiveWorkloadDecisionEngine {
  decide(report) {
    const freeGB  = parseFloat(report.memory.freeGB);
    const cpuCount = report.cpu.count;

    // Each app needs ~0.25 GB free RAM to safely generate
    const byMem  = Math.floor(freeGB / 0.25);
    const byCpu  = cpuCount * 2;
    const maxSafe = Math.min(byMem, byCpu, 20);
    const recommended = Math.max(maxSafe, 2); // minimum 2 guaranteed

    return {
      recommendedApps:    recommended,
      recommendedWorkers: Math.min(recommended, cpuCount, 5),
      reasoning: {
        freeMemGB:   freeGB,
        cpuCount:    cpuCount,
        byMemory:    byMem,
        byCPU:       byCpu,
        formula:     'min(floor(freeGB/0.25), cpu*2, 20)  floor→2',
        gpuDetected: report.gpu.detected,
      },
      timestamp: new Date().toISOString(),
    };
  }
}

// ─── Distributed Job Scheduler ────────────────────────────────────────────────
class DistributedJobScheduler extends EventEmitter {
  constructor(parallelism) {
    super();
    this.parallelism = Math.max(1, parallelism);
    this.queue       = [];
    this.running     = new Map();
    this.completed   = [];
    this.failed      = [];
    this.logs        = [];
  }

  schedule(configPaths) {
    this.queue = configPaths.map((p, i) => ({
      id:         `job-${i + 1}`,
      configPath: p,
      status:     'queued',
      retries:    0,
      maxRetries: 2,
      createdAt:  new Date().toISOString(),
    }));
    this._log('SCHEDULER', `${this.queue.length} jobs queued — ${this.parallelism} parallel workers`);
    this.emit('scheduled', { total: this.queue.length });
  }

  async run(outputDir) {
    while (this.queue.length > 0 || this.running.size > 0) {
      while (this.running.size < this.parallelism && this.queue.length > 0) {
        this._spawn(this.queue.shift(), outputDir);
      }
      if (this.running.size > 0) {
        await Promise.race(this.running.values());
      }
    }
  }

  _spawn(job, outputDir) {
    const promise = new Promise(resolve => {
      const cfg    = JSON.parse(fs.readFileSync(job.configPath, 'utf8'));
      const appDir = path.join(outputDir, cfg.appName);

      job.appName = cfg.appName;
      job.startedAt = new Date().toISOString();
      this._log('WORKER', `Starting ${job.id} → "${cfg.appName}" (${cfg.appId})`);
      this.emit('start', job);

      const worker = spawn('node', ['worker.js', job.configPath, appDir], {
        stdio: 'inherit',
      });

      worker.on('exit', code => {
        job.finishedAt = new Date().toISOString();

        if (code === 0) {
          job.status = 'completed';
          this.completed.push(job);
          this._log('WORKER', `✓ ${job.id} (${job.appName}) completed`);
          this.emit('done', job);

        } else if (job.retries < job.maxRetries) {
          job.retries++;
          job.status = 'retrying';
          this._log('WORKER', `↺ ${job.id} retry ${job.retries}/${job.maxRetries}`);
          this.queue.unshift(job);

        } else {
          job.status = 'failed';
          this.failed.push(job);
          this._log('WORKER', `✗ ${job.id} permanently failed`);
          this.emit('fail', job);
        }

        this.running.delete(job.id);
        resolve();
      });
    });

    this.running.set(job.id, promise);
  }

  _log(type, msg) {
    const entry = { timestamp: new Date().toISOString(), type, msg };
    this.logs.push(entry);
    console.log(`[${type}] ${msg}`);
  }

  stats() {
    return {
      total:     this.completed.length + this.failed.length,
      completed: this.completed.length,
      failed:    this.failed.length,
      queued:    this.queue.length,
      running:   this.running.size,
    };
  }
}

// ─── 5 Distinct App Definitions ───────────────────────────────────────────────
const APP_DEFINITIONS = [
  {
    appName:     'app1',
    appId:       'svc-001-user-auth',
    version:     '2.1.0',
    environment: 'production',
    port:        3001,
    features:    ['auth', 'dashboard', 'api'],
    description: 'User authentication & session management',
  },
  {
    appName:     'app2',
    appId:       'svc-002-analytics',
    version:     '1.4.7',
    environment: 'development',
    port:        3002,
    features:    ['dashboard', 'api'],
    description: 'Real-time analytics & metrics pipeline',
  },
  {
    appName:     'app3',
    appId:       'svc-003-payments',
    version:     '3.0.1',
    environment: 'staging',
    port:        3003,
    features:    ['api', 'auth'],
    description: 'Payment processing & transaction ledger',
  },
  {
    appName:     'app4',
    appId:       'svc-004-notifications',
    version:     '1.0.0',
    environment: 'production',
    port:        3004,
    features:    ['api'],
    description: 'Push notifications & message delivery',
  },
  {
    appName:     'app5',
    appId:       'svc-005-content',
    version:     '4.2.3',
    environment: 'development',
    port:        3005,
    features:    ['auth', 'dashboard', 'api'],
    description: 'Content management & publishing platform',
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const LINE = '═'.repeat(68);
  console.log('\n' + LINE);
  console.log('  ADAGDS — Adaptive Distributed App Generation & Deployment');
  console.log(`  Master Node  ·  ${APP_DEFINITIONS.length} applications scheduled`);
  console.log(LINE + '\n');

  // 1. Analyze resources
  const analyzer  = new SystemResourceAnalyzer();
  const resources = analyzer.analyze();
  console.log('[RESOURCE ANALYSIS]');
  console.log(JSON.stringify(resources, null, 2));

  // 2. Decide workload
  const engine   = new AdaptiveWorkloadDecisionEngine();
  const decision = engine.decide(resources);
  const workers  = decision.recommendedWorkers;
  console.log('\n[WORKLOAD DECISION]');
  console.log(JSON.stringify(decision, null, 2));

  // 3. Prepare directories
  const outputDir = path.join(process.cwd(), 'output');
  const configDir = path.join(process.cwd(), 'configs');

  for (const dir of [outputDir, configDir]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    } else {
      // Clear stale files only (not subdirs in output)
      fs.readdirSync(dir)
        .filter(f => fs.statSync(path.join(dir, f)).isFile())
        .forEach(f => fs.unlinkSync(path.join(dir, f)));
    }
  }

  // 4. Write config files for each app
  const configPaths = APP_DEFINITIONS.map(cfg => {
    const p = path.join(configDir, `${cfg.appName}.json`);
    fs.writeFileSync(p, JSON.stringify(cfg, null, 2));
    return p;
  });

  console.log(`\n[CONFIG] Written ${configPaths.length} config files → ./configs/`);

  // 5. Schedule + execute parallel builds
  const scheduler = new DistributedJobScheduler(workers);

  scheduler.on('scheduled', d =>
    console.log(`\n[EXECUTION] Starting parallel build — ${d.total} jobs, ${workers} workers\n`)
  );
  scheduler.on('start', j => console.log(`  → dispatched ${j.id} (${j.appName})`));
  scheduler.on('done',  j => console.log(`  ✓ finished  ${j.id} (${j.appName})`));
  scheduler.on('fail',  j => console.log(`  ✗ failed    ${j.id} (${j.appName})`));

  scheduler.schedule(configPaths);

  const t0 = Date.now();
  await scheduler.run(outputDir);
  const elapsed = ((Date.now() - t0) / 1000).toFixed(2);

  // 6. Build final report
  const stats = scheduler.stats();

  const deployedApps = APP_DEFINITIONS.map(a => ({
    appName:     a.appName,
    appId:       a.appId,
    description: a.description,
    endpoint:    `http://localhost:${a.port}`,
    environment: a.environment,
    version:     a.version,
    features:    a.features,
    directory:   path.join(outputDir, a.appName),
    status:      scheduler.completed.find(j => j.appName === a.appName) ? 'ready' : 'failed',
  }));

  const finalReport = {
    timestamp:    new Date().toISOString(),
    resources,
    decision,
    execution: {
      ...stats,
      elapsedSec: +elapsed,
      workers,
    },
    deployedApps,
    workerLogs: scheduler.logs,
  };

  // 7. Persist logs & report
  fs.writeFileSync(path.join(outputDir, 'final_report.json'),    JSON.stringify(finalReport, null, 2));
  fs.writeFileSync(path.join(outputDir, 'execution_logs.json'),  JSON.stringify(scheduler.logs, null, 2));
  fs.writeFileSync(path.join(outputDir, 'system_decisions.json'),JSON.stringify([decision], null, 2));

  // 8. Print summary
  console.log('\n' + LINE);
  console.log(`  DONE — ${stats.completed}/${APP_DEFINITIONS.length} apps built in ${elapsed}s`);
  if (stats.failed > 0) console.log(`  WARNING: ${stats.failed} app(s) failed`);
  console.log(LINE);
  console.log('\n  Generated Applications:\n');

  deployedApps.forEach(a => {
    const icon = a.status === 'ready' ? '✓' : '✗';
    console.log(`  ${icon}  ${a.appName.padEnd(6)}  ${a.endpoint.padEnd(28)}  [${a.environment.padEnd(11)}]  v${a.version}`);
    console.log(`        ${a.description}`);
    console.log();
  });

  console.log('  To launch apps (open separate terminals):\n');
  deployedApps.filter(a => a.status === 'ready').forEach(a => {
    console.log(`    cd output/${a.appName} && npm install && npm start`);
  });

  console.log('\n  Logs saved to:');
  console.log('    output/final_report.json');
  console.log('    output/execution_logs.json');
  console.log('    output/system_decisions.json\n');
}

main().catch(err => {
  console.error('\n[FATAL] Master node crashed:', err.message);
  process.exit(1);
});
