'use strict'
// IMPORT LIBRARIES
const WorkerNodes = require('worker-nodes')
// FINISH IMPORT LIBRARIES
const size = parseInt(process.env.POOL_SIZE)
const iterations = parseInt(process.env.NUM_ITERATIONS)
const data = {
  test: 'MYBENCH',
  taskType: process.env.TASK_TYPE,
  taskSize: parseInt(process.env.TASK_SIZE)
}

const workerNodes = new WorkerNodes(
  require.resolve('./workers/worker-nodes/function-to-bench-worker'),
  {
    minWorkers: Math.floor(size / 2),
    maxWorkers: size,
    taskTimeout: 60000 // this is the same as poolifier default
  }
)

async function run () {
  const promises = new Set()
  for (let i = 0; i < iterations; i++) {
    promises.add(workerNodes.call.functionToBench(data))
  }
  await Promise.all(promises)
  // eslint-disable-next-line n/no-process-exit
  process.exit()
}

(async () => {
  try {
    await run()
  } catch (e) {
    console.error(e)
    // eslint-disable-next-line n/no-process-exit
    process.exit(1)
  }
})()
