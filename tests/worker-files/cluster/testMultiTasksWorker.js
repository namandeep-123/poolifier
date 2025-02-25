'use strict'
const { ClusterWorker, KillBehaviors } = require('../../../lib')
const {
  jsonIntegerSerialization,
  factorial,
  fibonacci
} = require('../../test-utils')

module.exports = new ClusterWorker(
  {
    jsonIntegerSerialization: data => jsonIntegerSerialization(data.n),
    factorial: data => factorial(data.n),
    fibonacci: data => fibonacci(data.n)
  },
  {
    maxInactiveTime: 500,
    killBehavior: KillBehaviors.HARD
  }
)
