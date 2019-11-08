const { Worker } = require('worker_threads');
const { someText } = require('../common/someText');

/**
 * Spins up a worker that returns the word sent to it
 * 
 * Results will not be in order
 */

someText.forEach(word => {
  const worker = new Worker('./worker.js', { workerData: word });
  worker.on('message', console.log);
  worker.on('error', console.error);
  worker.on('exit', code => {
    if (code !== 0) {
      throw new Error(`Worker stopped with exit code ${code}`);
    }
  });
});
