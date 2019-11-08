const {
  parentPort, workerData
} = require('worker_threads');

const secret = 'aSecretWordNobodyKnows';

async function workIt() {
  parentPort.postMessage(workerData);
}

workIt();











