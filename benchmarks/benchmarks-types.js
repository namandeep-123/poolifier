const WorkerFunctions = {
  jsonIntegerSerialization: 'jsonIntegerSerialization',
  fibonacci: 'fibonacci',
  factorial: 'factorial',
  readWriteFiles: 'readWriteFiles'
}

const PoolTypes = {
  fixed: 'fixed',
  dynamic: 'dynamic'
}

const WorkerTypes = {
  thread: 'thread',
  cluster: 'cluster'
}

module.exports = { PoolTypes, WorkerFunctions, WorkerTypes }
