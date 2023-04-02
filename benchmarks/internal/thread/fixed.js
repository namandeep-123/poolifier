const {
  FixedThreadPool,
  WorkerChoiceStrategies
} = require('../../../lib/index')
const { runPoolifierTest } = require('../../benchmarks-utils')

const size = 30
const numberOfTasks = 1

const fixedPool = new FixedThreadPool(
  size,
  './benchmarks/internal/thread/worker.js'
)

const fixedPoolLessUsed = new FixedThreadPool(
  size,
  './benchmarks/internal/thread/worker.js',
  { workerChoiceStrategy: WorkerChoiceStrategies.LESS_USED }
)

const fixedPoolWeightedRoundRobin = new FixedThreadPool(
  size,
  './benchmarks/internal/thread/worker.js',
  { workerChoiceStrategy: WorkerChoiceStrategies.WEIGHTED_ROUND_ROBIN }
)

const fixedPoolFairShare = new FixedThreadPool(
  size,
  './benchmarks/internal/thread/worker.js',
  { workerChoiceStrategy: WorkerChoiceStrategies.FAIR_SHARE }
)

async function fixedThreadTest (
  { tasks, workerData } = { tasks: numberOfTasks, workerData: { proof: 'ok' } }
) {
  return runPoolifierTest(fixedPool, { tasks, workerData })
}

async function fixedThreadTestLessUsed (
  { tasks, workerData } = { tasks: numberOfTasks, workerData: { proof: 'ok' } }
) {
  return runPoolifierTest(fixedPoolLessUsed, { tasks, workerData })
}

async function fixedThreadTestWeightedRoundRobin (
  { tasks, workerData } = { tasks: numberOfTasks, workerData: { proof: 'ok' } }
) {
  return runPoolifierTest(fixedPoolWeightedRoundRobin, { tasks, workerData })
}

async function fixedThreadTestFairShare (
  { tasks, workerData } = { tasks: numberOfTasks, workerData: { proof: 'ok' } }
) {
  return runPoolifierTest(fixedPoolFairShare, { tasks, workerData })
}

module.exports = {
  fixedThreadTest,
  fixedThreadTestLessUsed,
  fixedThreadTestWeightedRoundRobin,
  fixedThreadTestFairShare
}
