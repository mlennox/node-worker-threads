const { Worker } = require('worker_threads');
const { performance } = require('perf_hooks');
const { someText } = require('../common/someText');
const os = require('os');

const cpuCount = os.cpus().length
console.log(`Available cpus : ${cpuCount}`)

// start the main event loop reporter
function startMainLoopTimer() {
  let previousTimestamp = performance.now();
  setInterval(() => {
    const timestamp = performance.now();
    const duration = ((timestamp - previousTimestamp) / 1000).toFixed(3);
    previousTimestamp = timestamp;
    console.log(`Main loop interval duration was ${duration}secs (should be 2secs)`);
  }, 2000);
}

// queue workers forever
function queueWorkers() {
  do {
    someText.forEach(word => {
      // we're adding a timestamp `queued` to show when the task was 
      const worker = new Worker('./worker.js', { workerData: { word, taskDuration: 2000 * (Math.random() + 1), queued: performance.now() } });
      worker.on('message', ({ word, queuetime, duration }) => {
        console.log(`queued for ${queuetime}ms, process took ${duration}ms "${word}"`);
      });
      worker.on('error', console.error);
      worker.on('exit', code => {
        if (code !== 0) {
          throw new Error(`Worker stopped with exit code ${code}`);
        }
      });
    });
  } while (true);
}

// kick off the main loop to report every two seconds
startMainLoopTimer();

// start adding workers after 10 seconds
setTimeout(() => {
  queueWorkers();
}, 10 * 1000);

