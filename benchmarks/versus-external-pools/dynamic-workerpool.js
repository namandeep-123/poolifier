// IMPORT LIBRARIES
const workerpool = require('workerpool')
// FINISH IMPORT LIBRARIES
const size = parseInt(process.env.POOL_SIZE)
const iterations = parseInt(process.env.NUM_ITERATIONS)
const dataArray = [
  'MYBENCH',
  process.env.TASK_TYPE,
  parseInt(process.env.TASK_SIZE)
]

const workerPool = workerpool.pool(
  './workers/workerpool/function-to-bench-worker.js',
  {
    minWorkers: size,
    maxWorkers: size * 3,
    workerType: 'thread'
  }
)

async function run () {
  const promises = []
  for (let i = 0; i < iterations; i++) {
    promises.push(workerPool.exec('functionToBench', dataArray))
  }
  await Promise.all(promises)
  // eslint-disable-next-line n/no-process-exit
  process.exit()
}

run()
