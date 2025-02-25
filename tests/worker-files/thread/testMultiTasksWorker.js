'use strict'
const { ThreadWorker, KillBehaviors } = require('../../../lib')
const {
  jsonIntegerSerialization,
  factorial,
  fibonacci
} = require('../../test-utils')

module.exports = new ThreadWorker(
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
