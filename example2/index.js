const { Worker } = require('worker_threads');
const { performance } = require('perf_hooks');
const { someText } = require('../common/someText');
const { argv } = require('yargs');
const os = require('os');
const chalk = require('chalk');
const { sleep } = require('../common/sleep');

function Example2() {

    // some scope 'globals'
    let completedTasks = [];
    let currentMainLoop = 1;

    // vars for params
    let pauseBetweenWorkers;

    function initialise() {
        console.log('argv', argv.pause);
        pauseBetweenWorkers = argv.pause || 30;

        console.log(`Available cpus : ${os.cpus().length}`);
        console.log(`Pause between adding new workers : ${pauseBetweenWorkers}ms`);
    }

    /**
    * Starts an interval timer that reports the actual duration of the interval
    * to show how the worker threads do not have any effect on main loop
    * 
    * @param {*} mainLoopPulse - sets the interval between reports on main loop
    */
    function startMainLoopTimer(mainLoopPulse) {
        let previousTimestamp = performance.now();
        setInterval(() => {
            const timestamp = performance.now();
            const duration = ((timestamp - previousTimestamp) / 1000).toFixed(3);
            previousTimestamp = timestamp;

            // calculate completed tasks metrics
            const countCompletedTasks = completedTasks.length;
            const averageQueuetime = countCompletedTasks > 0 ? completedTasks.reduce((acc, num) => { return acc + num; }, 0) / countCompletedTasks : 0;
            completedTasks = [];

            console.log(chalk.yellow(`* * * * * * Main loop number ${currentMainLoop} interval duration was ${duration}secs (should be ${mainLoopPulse}secs) * * * * * *`));
            console.log(chalk.red(`Worker threads finished task : ${countCompletedTasks}`));
            console.log(chalk.red(`Average queue time : ${(averageQueuetime / 1000).toFixed(3)}secs`));

            // increment the loop count - only used for display purposes
            currentMainLoop++;
        }, mainLoopPulse * 1000);
    }

    function setTimeoutToStartAddingWorkers(delayToAddingWorkers) {
        setTimeout(() => {
            console.log(chalk.cyan('- - - Starting to queue workers - - -'));
            queueWorkers(0, pauseBetweenWorkers);
        }, delayToAddingWorkers * 1000);
    }

    /**
    * An infinite, non-blocking loop to add worker threads
    * 
    * @param {*} wordIndex - tracks the index of the current word we're sending to the worker
    * @param {*} pause - pause in msec between generating a new worker 
    */
    async function queueWorkers(wordIndex, pause = 100) {
        await sleep(pause).then(() => {
            addWorker(wordIndex);
            queueWorkers((wordIndex + 1) % someText.length, pause);
        });
    }

    /**
* Creates a new worker thread and passes a word and a timestamp. The worker will
* just return the word and the timestamp will be used to calculate how long
* the worker thread was queued for before there was an available thread
* 
* @param {*} wordIndex - tracks the index of the current word we're sending to the worker
*/
    function addWorker(wordIndex) {
        const workerData = {
            word: someText[wordIndex],
            queued: performance.now()
        };
        const worker = new Worker('./worker.js', { workerData });
        worker.on('message', ({ queuetime }) => {
            completedTasks.push(queuetime);
        });
        worker.on('error', console.error);
        worker.on('exit', code => {
            if (code !== 0) {
                throw new Error(`Worker stopped with exit code ${code}`);
            }
        });
    }

    // parse CLI params
    initialise();

    // kick off the main loop
    startMainLoopTimer(1);

    setTimeoutToStartAddingWorkers(4);

}

Example2();