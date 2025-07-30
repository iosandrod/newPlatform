// MemoryTestManager.ts
// 适用于浏览器环境（Vite + TS）。需在 Chrome 启动参数加 --js-flags="--expose-gc" 才能使用 window.gc()。

type Bytes = number;

export interface TestOptions {
  iterations?: number;         // 每个组件循环次数，默认 30
  cycleDelayMs?: number;       // 每次 mount/unmount 间隔，默认 100ms
  warmup?: number;             // 预热轮次（不记录），默认 0
  autoDownloadCSV?: boolean;   // 结束后自动下载 CSV，默认 true
  logEvery?: number;           // 每 N 次循环 log 一次，默认 1（每次都打）
  stopIfGrowing?: boolean;     // 若持续增长则提前停止，默认 false
  growthToleranceMB?: number;  // 允许的误差（MB），默认 2
}

export interface TestTarget {
  name: string;
  // 返回一个销毁函数
  mountOnce: (container: HTMLElement) => { destroy: () => void };
}

export interface MemorySample {
  iteration: number;
  usedJSHeapSize: Bytes;
  usedMB: number;
  timestamp: number;
}

export interface TestResult {
  name: string;
  samples: MemorySample[];
  startHeapMB: number;
  endHeapMB: number;
  peakHeapMB: number;
  growthMB: number;
  suspectedLeak: boolean;
}

export class MemoryTestManager {
  private targets: TestTarget[] = [];
  private opts: Required<TestOptions>;

  constructor(opts: TestOptions = {}) {
    this.opts = {
      iterations: opts.iterations ?? 30,
      cycleDelayMs: opts.cycleDelayMs ?? 100,
      warmup: opts.warmup ?? 0,
      autoDownloadCSV: opts.autoDownloadCSV ?? true,
      logEvery: opts.logEvery ?? 1,
      stopIfGrowing: opts.stopIfGrowing ?? false,
      growthToleranceMB: opts.growthToleranceMB ?? 2,
    };
  }

  register(target: TestTarget) {
    this.targets.push(target);
  }

  async runAll(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    for (const t of this.targets) {
      console.group(`🧪 [MemoryTest] ${t.name}`);
      const r = await this.runOne(t);
      console.groupEnd();
      results.push(r);
    }

    const csv = this.buildCSV(results);
    if (this.opts.autoDownloadCSV) {
      this.downloadCSV(csv, `memory-test-${new Date().toISOString()}.csv`);
    }
    this.printSummary(results);

    return results;
  }

  async runOne(target: TestTarget): Promise<TestResult> {
    const samples: MemorySample[] = [];
    // Warmup
    for (let i = 0; i < this.opts.warmup; i++) {
      await this.singleCycle(target);
      await this.sleep(this.opts.cycleDelayMs);
    }
    this.gc();

    const start = this.readHeapMB();

    for (let i = 1; i <= this.opts.iterations; i++) {
      await this.singleCycle(target);
      this.gc();

      const used = this.readHeapBytes();
      const sample: MemorySample = {
        iteration: i,
        usedJSHeapSize: used,
        usedMB: this.bytesToMB(used),
        timestamp: Date.now(),
      };
      samples.push(sample);

      if (i % this.opts.logEvery === 0) {
        console.log(
          `[${target.name}] #${i} Heap = ${sample.usedMB.toFixed(2)} MB`
        );
      }

      if (this.opts.stopIfGrowing) {
        const growth = sample.usedMB - start;
        if (growth > this.opts.growthToleranceMB) {
          console.warn(
            `[${target.name}] 触发提前停止：增长 ${growth.toFixed(
              2
            )}MB > 容忍 ${this.opts.growthToleranceMB}MB`
          );
          break;
        }
      }

      await this.sleep(this.opts.cycleDelayMs);
    }

    const end = samples.at(-1)?.usedMB ?? this.readHeapMB();
    const peak = Math.max(...samples.map(s => s.usedMB));
    const growth = end - start;
    const suspectedLeak = growth > this.opts.growthToleranceMB;

    console.table({
      startMB: start.toFixed(2),
      endMB: end.toFixed(2),
      peakMB: peak.toFixed(2),
      growthMB: growth.toFixed(2),
      suspectedLeak,
    });

    return {
      name: target.name,
      samples,
      startHeapMB: start,
      endHeapMB: end,
      peakHeapMB: peak,
      growthMB: growth,
      suspectedLeak,
    };
  }

  // ========== Helpers ==========

  private async singleCycle(target: TestTarget) {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const { destroy } = target.mountOnce(container);
    destroy();
    container.remove();
  }

  private gc() {
    const w = window as any;
    if (typeof w.gc === 'function') {
      w.gc();
    }
  }

  private readHeapBytes(): Bytes {
    const pm = (performance as any).memory;
    if (!pm) return 0;
    return pm.usedJSHeapSize as number;
  }

  private readHeapMB(): number {
    return this.bytesToMB(this.readHeapBytes());
  }

  private bytesToMB(bytes: number): number {
    return bytes / 1024 / 1024;
  }

  private sleep(ms: number) {
    return new Promise(res => setTimeout(res, ms));
  }

  private buildCSV(results: TestResult[]): string {
    const rows: string[] = [
      'component,iteration,usedMB,usedJSHeapSizeBytes,timestamp',
    ];
    for (const r of results) {
      for (const s of r.samples) {
        rows.push(
          [
            r.name,
            s.iteration,
            s.usedMB.toFixed(2),
            s.usedJSHeapSize,
            new Date(s.timestamp).toISOString(),
          ].join(',')
        );
      }
    }
    return rows.join('\n');
  }

  private downloadCSV(csv: string, filename: string) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = filename;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  }

  private printSummary(results: TestResult[]) {
    console.log('========== Memory Test Summary ==========');
    const summary = results.map(r => ({
      component: r.name,
      startMB: r.startHeapMB.toFixed(2),
      endMB: r.endHeapMB.toFixed(2),
      peakMB: r.peakHeapMB.toFixed(2),
      growthMB: r.growthMB.toFixed(2),
      suspectedLeak: r.suspectedLeak,
    }));
    console.table(summary);
    const suspects = results.filter(r => r.suspectedLeak).map(r => r.name);
    if (suspects.length) {
      console.warn('⚠️ 疑似泄漏的组件：', suspects);
    } else {
      console.log('✅ 未发现明显泄漏（在当前阈值下）');
    }
  }
}
