import * as os from 'node:os'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import analyze from 'rollup-plugin-analyzer'
import command from 'rollup-plugin-command'
import del from 'rollup-plugin-delete'

const availableParallelism = () => {
  let availableParallelism = 1
  try {
    availableParallelism = os.availableParallelism()
  } catch {
    const numberOfCpus = os.cpus()
    if (Array.isArray(numberOfCpus) && numberOfCpus.length > 0) {
      availableParallelism = numberOfCpus.length
    }
  }
  return availableParallelism
}

const isDevelopmentBuild = process.env.BUILD === 'development'
const isAnalyzeBuild = process.env.ANALYZE
const isDocumentationBuild = process.env.DOCUMENTATION

const maxWorkers = Math.floor(availableParallelism() / 2)

export default {
  input: 'src/index.ts',
  strictDeprecations: true,
  output: [
    {
      format: 'cjs',
      ...(isDevelopmentBuild && {
        dir: 'lib',
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: 'src'
      }),
      ...(!isDevelopmentBuild && {
        file: 'lib/index.js',
        plugins: [terser({ maxWorkers })]
      })
    },
    {
      format: 'esm',
      ...(isDevelopmentBuild && {
        dir: 'lib',
        sourcemap: true,
        entryFileNames: '[name].mjs',
        preserveModules: true,
        preserveModulesRoot: 'src'
      }),
      ...(!isDevelopmentBuild && {
        file: 'lib/index.mjs',
        plugins: [terser({ maxWorkers })]
      })
    }
  ],
  external: [
    'node:async_hooks',
    'node:cluster',
    'node:crypto',
    'node:events',
    'node:fs',
    'node:os',
    'node:perf_hooks',
    'node:worker_threads'
  ],
  plugins: [
    typescript({
      tsconfig: isDevelopmentBuild
        ? 'tsconfig.development.json'
        : 'tsconfig.production.json'
    }),
    del({
      targets: ['lib/*']
    }),
    isAnalyzeBuild && analyze(),
    isDocumentationBuild && command('pnpm typedoc')
  ]
}
