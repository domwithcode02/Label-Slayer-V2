var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
var init_utils = __esm({
  "node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(createNotImplementedError, "createNotImplementedError");
    __name(notImplemented, "notImplemented");
    __name(notImplementedClass, "notImplementedClass");
  }
});

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin, _performanceNow, nodeTiming, PerformanceEntry, PerformanceMark, PerformanceMeasure, PerformanceResourceTiming, PerformanceObserverEntryList, Performance, PerformanceObserver, performance;
var init_performance = __esm({
  "node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
    nodeTiming = {
      name: "node",
      entryType: "node",
      startTime: 0,
      duration: 0,
      nodeStart: 0,
      v8Start: 0,
      bootstrapComplete: 0,
      environment: 0,
      loopStart: 0,
      loopExit: 0,
      idleTime: 0,
      uvMetricsInfo: {
        loopCount: 0,
        events: 0,
        eventsWaiting: 0
      },
      detail: void 0,
      toJSON() {
        return this;
      }
    };
    PerformanceEntry = class {
      static {
        __name(this, "PerformanceEntry");
      }
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name, options) {
        this.name = name;
        this.startTime = options?.startTime || _performanceNow();
        this.detail = options?.detail;
      }
      get duration() {
        return _performanceNow() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail
        };
      }
    };
    PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
      static {
        __name(this, "PerformanceMark");
      }
      entryType = "mark";
      constructor() {
        super(...arguments);
      }
      get duration() {
        return 0;
      }
    };
    PerformanceMeasure = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceMeasure");
      }
      entryType = "measure";
    };
    PerformanceResourceTiming = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceResourceTiming");
      }
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    PerformanceObserverEntryList = class {
      static {
        __name(this, "PerformanceObserverEntryList");
      }
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type) {
        return [];
      }
    };
    Performance = class {
      static {
        __name(this, "Performance");
      }
      __unenv__ = true;
      timeOrigin = _timeOrigin;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = void 0;
      timing = void 0;
      timerify(_fn, _options) {
        throw createNotImplementedError("Performance.timerify");
      }
      get nodeTiming() {
        return nodeTiming;
      }
      eventLoopUtilization() {
        return {};
      }
      markResourceTiming() {
        return new PerformanceResourceTiming("");
      }
      onresourcetimingbufferfull = null;
      now() {
        if (this.timeOrigin === _timeOrigin) {
          return _performanceNow();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name, type) {
        return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
      }
      getEntriesByType(type) {
        return this._entries.filter((e) => e.entryType === type);
      }
      mark(name, options) {
        const entry = new PerformanceMark(name, options);
        this._entries.push(entry);
        return entry;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
        }
        const entry = new PerformanceMeasure(measureName, {
          startTime: start,
          detail: {
            start,
            end
          }
        });
        this._entries.push(entry);
        return entry;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      addEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.addEventListener");
      }
      removeEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw createNotImplementedError("Performance.dispatchEvent");
      }
      toJSON() {
        return this;
      }
    };
    PerformanceObserver = class {
      static {
        __name(this, "PerformanceObserver");
      }
      __unenv__ = true;
      static supportedEntryTypes = [];
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw createNotImplementedError("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw createNotImplementedError("PerformanceObserver.observe");
      }
      bind(fn) {
        return fn;
      }
      runInAsyncScope(fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      asyncId() {
        return 0;
      }
      triggerAsyncId() {
        return 0;
      }
      emitDestroy() {
        return this;
      }
    };
    performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
  }
});

// node_modules/unenv/dist/runtime/node/perf_hooks.mjs
var init_perf_hooks = __esm({
  "node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  }
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
var init_performance2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
    globalThis.performance = performance;
    globalThis.Performance = Performance;
    globalThis.PerformanceEntry = PerformanceEntry;
    globalThis.PerformanceMark = PerformanceMark;
    globalThis.PerformanceMeasure = PerformanceMeasure;
    globalThis.PerformanceObserver = PerformanceObserver;
    globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
    globalThis.PerformanceResourceTiming = PerformanceResourceTiming;
  }
});

// node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default;
var init_noop = __esm({
  "node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default = Object.assign(() => {
    }, { __unenv__: true });
  }
});

// node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";
var _console, _ignoreErrors, _stderr, _stdout, log, info, trace, debug, table, error, warn, createTask, clear, count, countReset, dir, dirxml, group, groupEnd, groupCollapsed, profile, profileEnd, time, timeEnd, timeLog, timeStamp, Console, _times, _stdoutErrorHandler, _stderrErrorHandler;
var init_console = __esm({
  "node_modules/unenv/dist/runtime/node/console.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console = globalThis.console;
    _ignoreErrors = true;
    _stderr = new Writable();
    _stdout = new Writable();
    log = _console?.log ?? noop_default;
    info = _console?.info ?? log;
    trace = _console?.trace ?? info;
    debug = _console?.debug ?? log;
    table = _console?.table ?? log;
    error = _console?.error ?? log;
    warn = _console?.warn ?? error;
    createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
    clear = _console?.clear ?? noop_default;
    count = _console?.count ?? noop_default;
    countReset = _console?.countReset ?? noop_default;
    dir = _console?.dir ?? noop_default;
    dirxml = _console?.dirxml ?? noop_default;
    group = _console?.group ?? noop_default;
    groupEnd = _console?.groupEnd ?? noop_default;
    groupCollapsed = _console?.groupCollapsed ?? noop_default;
    profile = _console?.profile ?? noop_default;
    profileEnd = _console?.profileEnd ?? noop_default;
    time = _console?.time ?? noop_default;
    timeEnd = _console?.timeEnd ?? noop_default;
    timeLog = _console?.timeLog ?? noop_default;
    timeStamp = _console?.timeStamp ?? noop_default;
    Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
    _times = /* @__PURE__ */ new Map();
    _stdoutErrorHandler = noop_default;
    _stderrErrorHandler = noop_default;
  }
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole, assert, clear2, context, count2, countReset2, createTask2, debug2, dir2, dirxml2, error2, group2, groupCollapsed2, groupEnd2, info2, log2, profile2, profileEnd2, table2, time2, timeEnd2, timeLog2, timeStamp2, trace2, warn2, console_default;
var init_console2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole = globalThis["console"];
    ({
      assert,
      clear: clear2,
      context: (
        // @ts-expect-error undocumented public API
        context
      ),
      count: count2,
      countReset: countReset2,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask2
      ),
      debug: debug2,
      dir: dir2,
      dirxml: dirxml2,
      error: error2,
      group: group2,
      groupCollapsed: groupCollapsed2,
      groupEnd: groupEnd2,
      info: info2,
      log: log2,
      profile: profile2,
      profileEnd: profileEnd2,
      table: table2,
      time: time2,
      timeEnd: timeEnd2,
      timeLog: timeLog2,
      timeStamp: timeStamp2,
      trace: trace2,
      warn: warn2
    } = workerdConsole);
    Object.assign(workerdConsole, {
      Console,
      _ignoreErrors,
      _stderr,
      _stderrErrorHandler,
      _stdout,
      _stdoutErrorHandler,
      _times
    });
    console_default = workerdConsole;
  }
});

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default;
  }
});

// node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime;
var init_hrtime = __esm({
  "node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
      const now = Date.now();
      const seconds = Math.trunc(now / 1e3);
      const nanos = now % 1e3 * 1e6;
      if (startTime) {
        let diffSeconds = seconds - startTime[0];
        let diffNanos = nanos - startTime[0];
        if (diffNanos < 0) {
          diffSeconds = diffSeconds - 1;
          diffNanos = 1e9 + diffNanos;
        }
        return [diffSeconds, diffNanos];
      }
      return [seconds, nanos];
    }, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
      return BigInt(Date.now() * 1e6);
    }, "bigint") });
  }
});

// node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream;
var init_write_stream = __esm({
  "node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream = class {
      static {
        __name(this, "WriteStream");
      }
      fd;
      columns = 80;
      rows = 24;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      clearLine(dir3, callback) {
        callback && callback();
        return false;
      }
      clearScreenDown(callback) {
        callback && callback();
        return false;
      }
      cursorTo(x, y, callback) {
        callback && typeof callback === "function" && callback();
        return false;
      }
      moveCursor(dx, dy, callback) {
        callback && callback();
        return false;
      }
      getColorDepth(env2) {
        return 1;
      }
      hasColors(count3, env2) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      write(str, encoding, cb) {
        if (str instanceof Uint8Array) {
          str = new TextDecoder().decode(str);
        }
        try {
          console.log(str);
        } catch {
        }
        cb && typeof cb === "function" && cb();
        return false;
      }
    };
  }
});

// node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream;
var init_read_stream = __esm({
  "node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream = class {
      static {
        __name(this, "ReadStream");
      }
      fd;
      isRaw = false;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      setRawMode(mode) {
        this.isRaw = mode;
        return this;
      }
    };
  }
});

// node_modules/unenv/dist/runtime/node/tty.mjs
var init_tty = __esm({
  "node_modules/unenv/dist/runtime/node/tty.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
  }
});

// node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION;
var init_node_version = __esm({
  "node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    NODE_VERSION = "22.14.0";
  }
});

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";
var Process;
var init_process = __esm({
  "node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    init_node_version();
    Process = class _Process extends EventEmitter {
      static {
        __name(this, "Process");
      }
      env;
      hrtime;
      nextTick;
      constructor(impl) {
        super();
        this.env = impl.env;
        this.hrtime = impl.hrtime;
        this.nextTick = impl.nextTick;
        for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
          const value = this[prop];
          if (typeof value === "function") {
            this[prop] = value.bind(this);
          }
        }
      }
      // --- event emitter ---
      emitWarning(warning, type, code) {
        console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
      }
      emit(...args) {
        return super.emit(...args);
      }
      listeners(eventName) {
        return super.listeners(eventName);
      }
      // --- stdio (lazy initializers) ---
      #stdin;
      #stdout;
      #stderr;
      get stdin() {
        return this.#stdin ??= new ReadStream(0);
      }
      get stdout() {
        return this.#stdout ??= new WriteStream(1);
      }
      get stderr() {
        return this.#stderr ??= new WriteStream(2);
      }
      // --- cwd ---
      #cwd = "/";
      chdir(cwd2) {
        this.#cwd = cwd2;
      }
      cwd() {
        return this.#cwd;
      }
      // --- dummy props and getters ---
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return `v${NODE_VERSION}`;
      }
      get versions() {
        return { node: NODE_VERSION };
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      // --- noop methods ---
      ref() {
      }
      unref() {
      }
      // --- unimplemented methods ---
      umask() {
        throw createNotImplementedError("process.umask");
      }
      getBuiltinModule() {
        return void 0;
      }
      getActiveResourcesInfo() {
        throw createNotImplementedError("process.getActiveResourcesInfo");
      }
      exit() {
        throw createNotImplementedError("process.exit");
      }
      reallyExit() {
        throw createNotImplementedError("process.reallyExit");
      }
      kill() {
        throw createNotImplementedError("process.kill");
      }
      abort() {
        throw createNotImplementedError("process.abort");
      }
      dlopen() {
        throw createNotImplementedError("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw createNotImplementedError("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw createNotImplementedError("process.loadEnvFile");
      }
      disconnect() {
        throw createNotImplementedError("process.disconnect");
      }
      cpuUsage() {
        throw createNotImplementedError("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw createNotImplementedError("process.initgroups");
      }
      openStdin() {
        throw createNotImplementedError("process.openStdin");
      }
      assert() {
        throw createNotImplementedError("process.assert");
      }
      binding() {
        throw createNotImplementedError("process.binding");
      }
      // --- attached interfaces ---
      permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
      report = {
        directory: "",
        filename: "",
        signal: "SIGUSR2",
        compact: false,
        reportOnFatalError: false,
        reportOnSignal: false,
        reportOnUncaughtException: false,
        getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
        writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
      };
      finalization = {
        register: /* @__PURE__ */ notImplemented("process.finalization.register"),
        unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
        registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
      };
      memoryUsage = Object.assign(() => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
      // --- undefined props ---
      mainModule = void 0;
      domain = void 0;
      // optional
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      // internals
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
  }
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess, getBuiltinModule, exit, platform, nextTick, unenvProcess, abort, addListener, allowedNodeEnvironmentFlags, hasUncaughtExceptionCaptureCallback, setUncaughtExceptionCaptureCallback, loadEnvFile, sourceMapsEnabled, arch, argv, argv0, chdir, config, connected, constrainedMemory, availableMemory, cpuUsage, cwd, debugPort, dlopen, disconnect, emit, emitWarning, env, eventNames, execArgv, execPath, finalization, features, getActiveResourcesInfo, getMaxListeners, hrtime3, kill, listeners, listenerCount, memoryUsage, on, off, once, pid, ppid, prependListener, prependOnceListener, rawListeners, release, removeAllListeners, removeListener, report, resourceUsage, setMaxListeners, setSourceMapsEnabled, stderr, stdin, stdout, title, throwDeprecation, traceDeprecation, umask, uptime, version, versions, domain, initgroups, moduleLoadList, reallyExit, openStdin, assert2, binding, send, exitCode, channel, getegid, geteuid, getgid, getgroups, getuid, setegid, seteuid, setgid, setgroups, setuid, permission, mainModule, _events, _eventsCount, _exiting, _maxListeners, _debugEnd, _debugProcess, _fatalException, _getActiveHandles, _getActiveRequests, _kill, _preload_modules, _rawDebug, _startProfilerIdleNotifier, _stopProfilerIdleNotifier, _tickCallback, _disconnect, _handleQueue, _pendingMessage, _channel, _send, _linkedBinding, _process, process_default;
var init_process2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess = globalThis["process"];
    getBuiltinModule = globalProcess.getBuiltinModule;
    ({ exit, platform, nextTick } = getBuiltinModule(
      "node:process"
    ));
    unenvProcess = new Process({
      env: globalProcess.env,
      hrtime,
      nextTick
    });
    ({
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      finalization,
      features,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      on,
      off,
      once,
      pid,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    } = unenvProcess);
    _process = {
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exit,
      finalization,
      features,
      getBuiltinModule,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      nextTick,
      on,
      off,
      once,
      pid,
      platform,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      // @ts-expect-error old API
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    };
    process_default = _process;
  }
});

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default;
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
  }
});

// node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// src/lib/db.ts
function getDb(env2) {
  return env2.LABELSLAYER_D1;
}
async function query(db, sql, params = []) {
  const stmt = db.prepare(sql);
  const bound = params.length ? stmt.bind(...params) : stmt;
  const res = await bound.all();
  return res.results || [];
}
async function run(db, sql, params = []) {
  const stmt = db.prepare(sql);
  const bound = params.length ? stmt.bind(...params) : stmt;
  await bound.run();
}
var init_db = __esm({
  "src/lib/db.ts"() {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(getDb, "getDb");
    __name(query, "query");
    __name(run, "run");
  }
});

// src/lib/etag.ts
async function makeEtag(obj, salt) {
  const enc = new TextEncoder();
  const input = JSON.stringify(obj ?? {}) + String(salt ?? "");
  const data = enc.encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = Array.from(new Uint8Array(digest));
  const hex = bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
  return `"W/${hex.slice(0, 32)}"`;
}
var init_etag = __esm({
  "src/lib/etag.ts"() {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(makeEtag, "makeEtag");
  }
});

// src/lib/openai.ts
async function requestGpt4oVision(env2, input, timeoutMs = 5e3) {
  if (!env2.OPENAI_API_KEY) {
    const marker = "imageUrl" in input ? input.imageUrl : input.imageBase64.slice(0, 16);
    const pHash = "pHash" in input && input.pHash ? input.pHash : "unknown";
    return {
      ok: true,
      summary: `Mock analysis for ${pHash}`,
      tags: ["mock", "label", "nutrition"],
      confidence: 0.42,
      source: "stub"
    };
  }
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const body = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this product label and summarize key nutrition and allergens." },
            "imageUrl" in input ? { type: "image_url", image_url: input.imageUrl } : { type: "image", image_base64: input.imageBase64, mime_type: input.mimeType ?? "image/jpeg" }
          ]
        }
      ]
    };
    const res = await fetch((env2.OPENAI_BASE_URL ?? "https://api.openai.com/v1") + "/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env2.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    const json2 = await res.json().catch(() => ({}));
    const text = json2?.choices?.[0]?.message?.content || json2?.choices?.[0]?.message?.text || "No content from OpenAI";
    return {
      ok: res.ok,
      summary: String(text).slice(0, 512),
      tags: [],
      confidence: res.ok ? 0.9 : 0,
      source: "openai"
    };
  } catch (_e) {
    return {
      ok: false,
      summary: "OpenAI request failed",
      tags: [],
      confidence: 0,
      source: "openai"
    };
  } finally {
    clearTimeout(id);
  }
}
var init_openai = __esm({
  "src/lib/openai.ts"() {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(requestGpt4oVision, "requestGpt4oVision");
  }
});

// src/lib/aiAnalysis.ts
function generateMockAnalysis(pHash) {
  const hashNum = parseInt(pHash.substring(0, 4), 16);
  const rating = 40 + hashNum % 50;
  const productTypes = ["Organic Milk", "Whole Grain Bread", "Greek Yogurt", "Almond Butter", "Protein Bar"];
  const productIndex = hashNum % productTypes.length;
  const baseProduct = productTypes[productIndex] || "Generic Product";
  return {
    name: `${baseProduct} ${pHash.substring(0, 6)}`,
    description: `Analyzed ${baseProduct.toLowerCase()} product with pHash ${pHash}. ${rating >= 70 ? "High quality ingredients with minimal processing." : rating >= 50 ? "Good quality with some processed ingredients." : "Highly processed with multiple additives."}`,
    rating,
    ratingColor: rating >= 70 ? "#4caf50" : rating >= 50 ? "#ff9800" : "#f44336",
    ingredients: generateMockIngredients(rating, productIndex),
    concerns: rating < 60 ? generateMockConcerns(rating) : []
  };
}
function generateMockIngredients(rating, productType) {
  const baseIngredients = [
    {
      name: "Water",
      rating: "neutral",
      description: "Primary ingredient in most food products, provides hydration",
      benefits: ["Hydration", "Solvent for nutrients"],
      concerns: []
    }
  ];
  if (rating >= 70) {
    baseIngredients.push({
      name: "Organic Oats",
      rating: "good",
      description: "Whole grain oats rich in fiber and protein",
      benefits: ["Heart Health", "Fiber", "Sustained Energy"],
      concerns: []
    });
    baseIngredients.push({
      name: "Natural Vanilla Extract",
      rating: "good",
      description: "Pure vanilla extract from vanilla beans",
      benefits: ["Natural Flavoring", "Antioxidants"],
      concerns: []
    });
  } else if (rating >= 50) {
    baseIngredients.push({
      name: "Enriched Flour",
      rating: "neutral",
      description: "Wheat flour with added vitamins and minerals",
      benefits: ["Fortified Nutrients", "Energy"],
      concerns: ["Processed Grain"]
    });
    baseIngredients.push({
      name: "Natural Flavors",
      rating: "neutral",
      description: "Flavor compounds derived from natural sources",
      benefits: ["Taste Enhancement"],
      concerns: ["Vague Labeling"]
    });
  } else {
    baseIngredients.push({
      name: "High Fructose Corn Syrup",
      rating: "bad",
      description: "Processed sweetener linked to health concerns",
      benefits: ["Sweetness", "Preservation"],
      concerns: ["Blood Sugar Spikes", "Linked to Obesity"]
    });
    baseIngredients.push({
      name: "Artificial Colors",
      rating: "bad",
      description: "Synthetic food coloring agents",
      benefits: ["Visual Appeal"],
      concerns: ["Hyperactivity in Children", "Artificial Additives"]
    });
  }
  return baseIngredients;
}
function generateMockConcerns(rating) {
  const concerns = [];
  if (rating < 40) {
    concerns.push("High in artificial additives and preservatives");
    concerns.push("Contains multiple processed ingredients");
    concerns.push("High sugar content (>15g per serving)");
  } else if (rating < 60) {
    concerns.push("Contains some processed ingredients");
    concerns.push("Moderate sugar content");
  }
  return concerns;
}
async function createOrFindProduct(analysisData, db) {
  const productId = `prod-${crypto.randomUUID()}`;
  try {
    await run(
      db,
      `INSERT OR IGNORE INTO products (id, name, brand, analysis_generated, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        productId,
        analysisData.name,
        null,
        // Extract from AI if available in future
        true,
        (/* @__PURE__ */ new Date()).toISOString(),
        (/* @__PURE__ */ new Date()).toISOString()
      ]
    );
    return productId;
  } catch (error4) {
    console.error("Error creating product:", error4);
    throw new Error("Failed to create product record");
  }
}
async function parseAIAnalysis(visionResult) {
  return generateMockAnalysis(Math.random().toString(36).substring(7));
}
var init_aiAnalysis = __esm({
  "src/lib/aiAnalysis.ts"() {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_db();
    __name(generateMockAnalysis, "generateMockAnalysis");
    __name(generateMockIngredients, "generateMockIngredients");
    __name(generateMockConcerns, "generateMockConcerns");
    __name(createOrFindProduct, "createOrFindProduct");
    __name(parseAIAnalysis, "parseAIAnalysis");
  }
});

// src/jobs/analysisWorker.ts
var analysisWorker_exports = {};
__export(analysisWorker_exports, {
  processAnalysisJob: () => processAnalysisJob
});
async function processAnalysisJob(msg, env2, _ctx) {
  const { analysisId, pHash } = msg.body;
  const db = getDb(env2);
  const existing = await query(
    db,
    `SELECT status FROM analysis_records WHERE analysis_id = ? LIMIT 1`,
    [analysisId]
  );
  if (!existing.length) {
    return;
  }
  const current = String(existing[0].status);
  if (current === "succeeded" || current === "failed") {
    return;
  }
  const latest = await query(
    db,
    `SELECT analysis_id, summary, etag, product_id, analysis_data_json
     FROM analysis_records
     WHERE phash = ? AND status = 'succeeded'
     ORDER BY updated_at DESC
     LIMIT 1`,
    [pHash]
  );
  if (latest.length) {
    const { product_id, summary, etag, analysis_data_json } = latest[0];
    await run(
      db,
      `UPDATE analysis_records
       SET status = 'succeeded', summary = ?, etag = ?, product_id = ?, analysis_data_json = ?, updated_at = ?
       WHERE analysis_id = ?`,
      [summary ?? null, etag ?? null, product_id ?? null, analysis_data_json ?? null, (/* @__PURE__ */ new Date()).toISOString(), analysisId]
    );
    return;
  }
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  await run(
    db,
    `UPDATE analysis_records SET status = 'processing', updated_at = ? WHERE analysis_id = ?`,
    [nowIso, analysisId]
  );
  const mcpConfigured = Boolean(env2.MCP_CONTEXT7_ENDPOINT || env2.MCP_SEQUENTIAL_ENDPOINT);
  const openaiConfigured = Boolean(env2.OPENAI_API_KEY);
  let analysisData;
  let productId;
  try {
    if (!mcpConfigured || !openaiConfigured) {
      console.log(`Generating mock analysis for pHash: ${pHash}`);
      analysisData = generateMockAnalysis(pHash);
      productId = await createOrFindProduct(analysisData, db);
    } else {
      console.log(`Performing AI analysis for pHash: ${pHash}`);
      try {
        const visionResult = await requestGpt4oVision(env2, {
          imageUrl: msg.body.image?.url ?? "about:blank",
          pHash
        });
        analysisData = await parseAIAnalysis(visionResult.summary || "");
        productId = await createOrFindProduct(analysisData, db);
      } catch (aiError) {
        console.warn("AI analysis failed, falling back to mock:", aiError);
        analysisData = generateMockAnalysis(pHash);
        productId = await createOrFindProduct(analysisData, db);
      }
    }
    const etag = await makeEtag({ analysisId, pHash, analysisData, schemaVersion: env2.SCHEMA_VERSION }, env2.ETAG_SALT);
    await run(
      db,
      `UPDATE analysis_records 
       SET status = 'succeeded', 
           summary = ?, 
           analysis_data_json = ?, 
           product_id = ?, 
           etag = ?, 
           updated_at = ?
       WHERE analysis_id = ?`,
      [
        analysisData.description,
        // Keep summary for backward compatibility
        JSON.stringify(analysisData),
        productId,
        etag,
        (/* @__PURE__ */ new Date()).toISOString(),
        analysisId
      ]
    );
    console.log(`Analysis completed for ${analysisId}, created product ${productId}`);
  } catch (error4) {
    console.error("Analysis worker error:", error4);
    await run(
      db,
      `UPDATE analysis_records SET status = 'failed', updated_at = ? WHERE analysis_id = ?`,
      [(/* @__PURE__ */ new Date()).toISOString(), analysisId]
    );
  }
}
var init_analysisWorker = __esm({
  "src/jobs/analysisWorker.ts"() {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_db();
    init_etag();
    init_openai();
    init_aiAnalysis();
    __name(processAnalysisJob, "processAnalysisJob");
  }
});

// .wrangler/tmp/bundle-NJQ9e5/middleware-loader.entry.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// .wrangler/tmp/bundle-NJQ9e5/middleware-insertion-facade.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/index.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/handlers/health.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/lib/responses.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function json(data, init) {
  const body = JSON.stringify(data);
  const headers = new Headers(init?.headers || {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }
  return new Response(body, { status: init?.status ?? 200, headers });
}
__name(json, "json");
function error3(code, message, status = 400, details) {
  return json(
    {
      error: {
        code,
        message,
        details: details || {}
      }
    },
    { status }
  );
}
__name(error3, "error");
function notModified(etag) {
  const headers = new Headers();
  headers.set("ETag", etag);
  return new Response(null, { status: 304, headers });
}
__name(notModified, "notModified");

// src/handlers/health.ts
async function handleHealth(_req, env2) {
  const body = {
    ok: true,
    service: "labelslayer-backend",
    version: env2.API_VERSION || "0.0.0",
    schemaVersion: env2.SCHEMA_VERSION || "0000",
    time: (/* @__PURE__ */ new Date()).toISOString()
  };
  return json(body, { status: 200 });
}
__name(handleHealth, "handleHealth");

// src/handlers/analysis/byHash.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_db();
init_etag();

// src/lib/r2.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
async function getSignedUrl(env2, key, ttlSeconds) {
  const expires = Math.floor(Date.now() / 1e3) + (ttlSeconds ?? Number(env2.SIGNED_URL_TTL_SECONDS ?? 900));
  if (typeof env2.R2_BUCKET.createSignedUrl === "function") {
    const signed = await env2.R2_BUCKET.createSignedUrl(key, { method: "GET", expires });
    return signed.url;
  }
  const url = new URL(`https://r2.example/${encodeURIComponent(key)}`);
  url.searchParams.set("exp", String(expires));
  return url.toString();
}
__name(getSignedUrl, "getSignedUrl");

// src/handlers/analysis/byHash.ts
var PHASH_RE_STRICT = /^[a-f0-9]{16}$/;
var IDEM_TTL_SECONDS = 15 * 60;
async function getIdemKey(db, key) {
  const rows = await query(db, `SELECT key, response_status, response_body, last_seen_at FROM idempotency_keys WHERE key = ? LIMIT 1`, [key]);
  return rows[0] || null;
}
__name(getIdemKey, "getIdemKey");
async function upsertIdemKey(db, key, method, route, status, body) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const bodyStr = typeof body === "string" ? body : JSON.stringify(body ?? null);
  await run(
    db,
    `INSERT INTO idempotency_keys (key, method, route, first_seen_at, last_seen_at, response_status, response_body)
                 VALUES (?, ?, ?, ?, ?, ?, ?)
                 ON CONFLICT(key) DO UPDATE SET last_seen_at=excluded.last_seen_at, response_status=COALESCE(excluded.response_status, idempotency_keys.response_status), response_body=COALESCE(excluded.response_body, idempotency_keys.response_body)`,
    [key, method, route, now, now, status ?? null, bodyStr ?? null]
  );
}
__name(upsertIdemKey, "upsertIdemKey");
async function handleAnalysisByHash(req, env2, ctx) {
  let body;
  try {
    body = await req.json();
  } catch {
    return error3("BAD_JSON", "Invalid JSON body", 400);
  }
  const raw = String(body?.pHash || "");
  const pHash = raw.toLowerCase();
  if (!PHASH_RE_STRICT.test(pHash)) {
    return error3("INVALID_PHASH", "pHash must be exactly 16 lowercase hex chars", 400);
  }
  const db = getDb(env2);
  const rows = await query(
    db,
    `SELECT analysis_id, product_id, phash, status, summary, etag, image_key, product_name, product_brand, product_upc, updated_at, analysis_data_json
     FROM v_latest_analysis_by_phash WHERE phash = ? LIMIT 1`,
    [pHash]
  );
  if (rows.length) {
    const r = rows[0];
    let analysisData;
    if (r.analysis_data_json) {
      try {
        analysisData = JSON.parse(r.analysis_data_json);
      } catch (parseError) {
        console.warn("Failed to parse analysis_data_json:", parseError);
        analysisData = void 0;
      }
    }
    const record = {
      analysisId: String(r.analysis_id),
      productId: r.product_id ? String(r.product_id) : null,
      pHash: String(r.phash),
      status: String(r.status),
      summary: r.summary ?? null,
      etag: r.etag ?? null,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: r.updated_at ? String(r.updated_at) : (/* @__PURE__ */ new Date()).toISOString()
    };
    const etag = r.etag || await makeEtag(record, env2.ETAG_SALT);
    const ifNone = req.headers.get("If-None-Match");
    if (ifNone && ifNone === etag) {
      return notModified(etag);
    }
    let signedImageUrl;
    if (r.image_key) {
      signedImageUrl = await getSignedUrl(env2, String(r.image_key), Number(env2.SIGNED_URL_TTL_SECONDS ?? 900));
    }
    const product = r.product_id ? {
      id: String(r.product_id),
      name: analysisData?.name || String(r.product_name ?? "Unknown"),
      brand: r.product_brand ?? null,
      upc: r.product_upc ?? null,
      imageKey: r.image_key ?? null
    } : null;
    const resp2 = {
      hit: true,
      record: {
        ...record,
        etag,
        analysisData
        // Add structured data to response
      },
      product: product ? {
        ...product,
        name: analysisData?.name || product.name || "Unknown Product"
      } : null,
      signedImageUrl: signedImageUrl ?? null
    };
    const res2 = json(resp2, { status: 200 });
    res2.headers.set("ETag", etag);
    res2.headers.set("X-Schema-Version", env2.SCHEMA_VERSION);
    return res2;
  }
  const idem = req.headers.get("Idempotency-Key") || void 0;
  if (idem) {
    const existing = await getIdemKey(db, idem);
    if (existing) {
      const ageSec = Math.floor((Date.now() - Date.parse(existing.last_seen_at)) / 1e3);
      if (ageSec < IDEM_TTL_SECONDS && existing.response_status) {
        const replayBody = existing.response_body ? JSON.parse(existing.response_body) : {};
        const res2 = json(replayBody, { status: Number(existing.response_status) });
        res2.headers.set("X-Idempotent-Replay", "1");
        res2.headers.set("X-Schema-Version", env2.SCHEMA_VERSION);
        return res2;
      }
    }
  }
  const analysisId = crypto.randomUUID();
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  await run(
    db,
    `INSERT OR IGNORE INTO image_signatures (phash, first_seen_at) VALUES (?, ?);`,
    [pHash, nowIso]
  );
  await run(
    db,
    `INSERT OR IGNORE INTO analysis_records (analysis_id, phash, status, summary, etag, created_at, updated_at)
     VALUES (?, ?, 'queued', NULL, NULL, ?, ?)`,
    [analysisId, pHash, nowIso, nowIso]
  );
  const job = { analysisId, pHash, r2Key: null };
  await env2.ANALYSIS_QUEUE.send(job);
  const resp = {
    hit: false,
    jobId: analysisId,
    retryAfterSeconds: 3
  };
  const res = json(resp, { status: 202 });
  res.headers.set("X-Schema-Version", env2.SCHEMA_VERSION);
  if (idem) {
    await upsertIdemKey(db, idem, "POST", "/analysis/by-hash", 202, resp);
  }
  return res;
}
__name(handleAnalysisByHash, "handleAnalysisByHash");

// src/handlers/analysis/analyze.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_db();
var PHASH_RE_STRICT2 = /^[a-f0-9]{16}$/;
async function handleAnalysisAnalyze(req, env2, _ctx) {
  let body;
  try {
    body = await req.json();
  } catch {
    return error3("BAD_JSON", "Invalid JSON body", 400);
  }
  if (!body.imageUrl && !body.imageBase64) {
    return error3("INVALID_INPUT", "Provide imageUrl or imageBase64", 400);
  }
  if (body.pHash) {
    const ph = String(body.pHash).toLowerCase();
    if (!PHASH_RE_STRICT2.test(ph)) {
      return error3("INVALID_PHASH", "pHash must be exactly 16 lowercase hex chars", 400);
    }
    body.pHash = ph;
  }
  const db = getDb(env2);
  const analysisId = crypto.randomUUID();
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const pHash = (body.pHash || "unknown").toLowerCase();
  await run(
    db,
    `INSERT OR IGNORE INTO image_signatures (phash, first_seen_at) VALUES (?, ?);`,
    [pHash, nowIso]
  );
  await run(
    db,
    `INSERT OR IGNORE INTO analysis_records (analysis_id, phash, status, summary, etag, created_at, updated_at)
     VALUES (?, ?, 'queued', NULL, NULL, ?, ?)`,
    [analysisId, pHash, nowIso, nowIso]
  );
  const job = {
    analysisId,
    pHash,
    image: body.imageUrl ? { url: body.imageUrl } : { base64Size: body.imageBase64?.length ?? 0 }
  };
  await env2.ANALYSIS_QUEUE.send(job);
  const resp = {
    analysisId,
    status: "queued",
    jobId: analysisId,
    retryAfterSeconds: 3
  };
  const res = json(resp, { status: 202 });
  res.headers.set("X-Schema-Version", env2.SCHEMA_VERSION);
  return res;
}
__name(handleAnalysisAnalyze, "handleAnalysisAnalyze");

// src/handlers/analysis/byProductId.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_db();
init_etag();
async function handleAnalysisByProductId(req, env2) {
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId");
  if (!productId) {
    return error3("INVALID_INPUT", "productId is required", 400);
  }
  const db = getDb(env2);
  const rows = await query(
    db,
    `SELECT analysis_id, product_id, phash, status, summary, etag, updated_at, analysis_data_json
     FROM analysis_records
     WHERE product_id = ?
     ORDER BY updated_at DESC
     LIMIT 1`,
    [productId]
  );
  if (!rows.length) {
    return error3("NOT_FOUND", "No analysis found for productId", 404);
  }
  const r = rows[0];
  let analysisData;
  if (r.analysis_data_json) {
    try {
      analysisData = JSON.parse(r.analysis_data_json);
    } catch (parseError) {
      console.warn("Failed to parse analysis_data_json:", parseError);
      analysisData = void 0;
    }
  }
  const record = {
    analysisId: String(r.analysis_id),
    productId: r.product_id ? String(r.product_id) : null,
    pHash: String(r.phash),
    status: String(r.status),
    summary: r.summary ?? null,
    etag: r.etag ?? null,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: r.updated_at ? String(r.updated_at) : (/* @__PURE__ */ new Date()).toISOString()
  };
  const etag = r.etag || await makeEtag(record, env2.ETAG_SALT);
  const ifNone = req.headers.get("If-None-Match");
  if (ifNone && ifNone === etag) {
    return notModified(etag);
  }
  const resp = {
    hit: true,
    record: {
      ...record,
      analysisData
    },
    etag
  };
  const res = json(resp, { status: 200 });
  res.headers.set("ETag", etag);
  res.headers.set("X-Schema-Version", env2.SCHEMA_VERSION);
  return res;
}
__name(handleAnalysisByProductId, "handleAnalysisByProductId");

// src/handlers/search.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_db();
async function handleSearch(req, env2) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const limit = Math.min(Number(url.searchParams.get("limit") || 10), 50);
  if (!q) {
    return json({ results: [] }, { status: 200 });
  }
  const like = `%${q.replace(/%/g, "").replace(/_/g, "")}%`;
  const rows = await query(
    getDb(env2),
    `SELECT id, name, brand, upc, image_key
     FROM products
     WHERE name LIKE ? OR brand LIKE ? OR upc LIKE ?
     LIMIT ?`,
    [like, like, like, limit]
  );
  const results = rows.map((r) => ({
    product: {
      id: String(r.id),
      name: String(r.name),
      brand: r.brand ?? null,
      upc: r.upc ?? null,
      imageKey: r.image_key ?? null
    },
    score: 0.5
    // simple placeholder score for LIKE-based search
  }));
  return json({ results }, { status: 200 });
}
__name(handleSearch, "handleSearch");

// src/handlers/history.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_db();
async function handleHistory(req, env2) {
  let body;
  try {
    body = await req.json();
  } catch {
    return error3("BAD_JSON", "Invalid JSON body", 400);
  }
  const events = Array.isArray(body?.events) ? body.events : [];
  if (!events.length) {
    return json({ accepted: 0 }, { status: 202 });
  }
  const db = getDb(env2);
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  let accepted = 0;
  for (const ev of events) {
    try {
      await run(
        db,
        `INSERT INTO user_history (user_id, type, product_id, analysis_id, metadata_json, occurred_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          ev.userId ?? null,
          String(ev.type || "unknown"),
          ev.productId ?? null,
          ev.analysisId ?? null,
          JSON.stringify(ev.metadata ?? {}),
          ev.occurredAt ?? nowIso,
          nowIso
        ]
      );
      accepted += 1;
    } catch {
    }
  }
  return json({ accepted }, { status: 202 });
}
__name(handleHistory, "handleHistory");

// src/lib/rateLimit.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var memoryBuckets = /* @__PURE__ */ new Map();
function getClientKey(req) {
  const ip = req.headers.get("cf-connecting-ip") || "0.0.0.0";
  const ua = req.headers.get("user-agent") || "unknown";
  return `${ip}:${ua.slice(0, 32)}`;
}
__name(getClientKey, "getClientKey");
async function withRateLimit(req, env2, next) {
  const limit = Number(env2.RATE_LIMIT_MAX_MINUTE ?? 120);
  const key = getClientKey(req);
  const now = Date.now();
  const minute = 60 * 1e3;
  let bucket = memoryBuckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + minute };
    memoryBuckets.set(key, bucket);
  }
  if (bucket.count >= limit) {
    const headers2 = {
      "RateLimit-Limit": limit,
      "RateLimit-Remaining": Math.max(0, limit - bucket.count),
      "RateLimit-Reset": Math.ceil((bucket.resetAt - now) / 1e3)
    };
    return new Response(
      JSON.stringify({
        error: {
          code: "RATE_LIMITED",
          message: "Too Many Requests",
          details: {}
        }
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "RateLimit-Limit": String(headers2["RateLimit-Limit"]),
          "RateLimit-Remaining": String(headers2["RateLimit-Remaining"]),
          "RateLimit-Reset": String(headers2["RateLimit-Reset"])
        }
      }
    );
  }
  bucket.count += 1;
  const headers = {
    "RateLimit-Limit": limit,
    "RateLimit-Remaining": Math.max(0, limit - bucket.count),
    "RateLimit-Reset": Math.ceil((bucket.resetAt - now) / 1e3)
  };
  return next(headers);
}
__name(withRateLimit, "withRateLimit");

// src/index.ts
function addCorsHeaders(resp, env2) {
  const headers = new Headers(resp.headers);
  const allowOrigin = env2.CORS_ALLOW_ORIGIN || "*";
  headers.set("Access-Control-Allow-Origin", allowOrigin);
  headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type,If-None-Match,Idempotency-Key");
  headers.set("Access-Control-Expose-Headers", "ETag,RateLimit-Limit,RateLimit-Remaining,RateLimit-Reset,X-Schema-Version");
  if (!headers.has("X-Schema-Version") && env2.SCHEMA_VERSION) {
    headers.set("X-Schema-Version", env2.SCHEMA_VERSION);
  }
  return new Response(resp.body, { status: resp.status, headers });
}
__name(addCorsHeaders, "addCorsHeaders");
function errJson(code, message, status = 400, env2, details) {
  const resp = error3(code, message, status, details);
  return env2 ? addCorsHeaders(resp, env2) : resp;
}
__name(errJson, "errJson");
var src_default = {
  async fetch(request, env2, ctx) {
    if (request.method === "OPTIONS") {
      return addCorsHeaders(new Response(null, { status: 204 }), env2);
    }
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method.toUpperCase();
    const rateLimited = /* @__PURE__ */ __name(async (handler) => {
      return withRateLimit(request, env2, async (rateHeaders) => {
        const res = await handler();
        const headers = new Headers(res.headers);
        for (const [k, v] of Object.entries(rateHeaders)) {
          headers.set(k, String(v));
        }
        if (!headers.has("X-Schema-Version") && env2.SCHEMA_VERSION) {
          headers.set("X-Schema-Version", env2.SCHEMA_VERSION);
        }
        return new Response(res.body, { status: res.status, headers });
      });
    }, "rateLimited");
    try {
      if (method === "GET" && path === "/health") {
        return rateLimited(async () => addCorsHeaders(await handleHealth(request, env2), env2));
      }
      if (path === "/analysis/by-hash" && method === "POST") {
        return rateLimited(async () => addCorsHeaders(await handleAnalysisByHash(request, env2, ctx), env2));
      }
      if (path === "/analysis/analyze" && method === "POST") {
        return rateLimited(async () => addCorsHeaders(await handleAnalysisAnalyze(request, env2, ctx), env2));
      }
      if (path === "/analysis/by-product-id" && method === "GET") {
        return rateLimited(async () => addCorsHeaders(await handleAnalysisByProductId(request, env2), env2));
      }
      if (path === "/search" && method === "GET") {
        return rateLimited(async () => addCorsHeaders(await handleSearch(request, env2), env2));
      }
      if (path === "/history" && method === "POST") {
        return rateLimited(async () => addCorsHeaders(await handleHistory(request, env2), env2));
      }
      return addCorsHeaders(
        errJson("NOT_FOUND", `Route ${method} ${path} not found`, 404, env2),
        env2
      );
    } catch (e) {
      const msg = e && e.message ? e.message : "Unexpected error";
      const resp = errJson("INTERNAL_ERROR", msg, 500, env2);
      return addCorsHeaders(resp, env2);
    }
  },
  // Queue consumer (analysis jobs)
  async queue(batch, env2, ctx) {
    const { processAnalysisJob: processAnalysisJob2 } = await Promise.resolve().then(() => (init_analysisWorker(), analysisWorker_exports));
    for (const msg of batch.messages) {
      try {
        await processAnalysisJob2(msg, env2, ctx);
        msg.ack();
      } catch (err) {
        msg.retry();
      }
    }
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error4 = reduceError(e);
    return Response.json(error4, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-NJQ9e5/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-NJQ9e5/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
