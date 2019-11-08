const {
  parentPort, workerData
} = require('worker_threads');
const { performance } = require('perf_hooks');

const { word, queued } = workerData;

// we want some timings
const startTime = performance.now();
const queuetime = startTime - queued;
// and we'll just return the word
parentPort.postMessage({ word, queuetime });



// const { sleep } = require('../common/sleep');

// async function pretendLongTask({ taskDuration, word, queued }) {
//   const startTime = performance.now();
//   const queuetime = startTime - queued;
//   // console.log(taskDuration, word, queued);
//   await sleep(taskDuration).then(() => {
//     const duration = performance.now() - startTime;
//     // console.log('sleeps done', taskDuration, word, queued, duration);
//     parentPort.postMessage({ word, queuetime, duration });
//   });
// }

// pretendLongTask(workerData);

// const crypto = require('crypto');
// const secret = 'aSecretWordNobodyKnows';

// async function hashIt() {
//   const hash = crypto.createHmac('sha256', secret)
//     .update(workerData)
//     .digest('hex');
//   parentPort.postMessage({
//     word: workerData,
//     hash
//   });
// }

// hashIt();











