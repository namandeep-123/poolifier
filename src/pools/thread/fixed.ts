import {
  MessageChannel,
  SHARE_ENV,
  Worker,
  isMainThread
} from 'node:worker_threads'
import type { Draft, MessageValue } from '../../utility-types'
import { AbstractPool } from '../abstract-pool'
import { type PoolOptions, type PoolType, PoolTypes } from '../pool'

/**
 * A thread worker with message channels for communication between main thread and thread worker.
 */
export type ThreadWorkerWithMessageChannel = Worker & Draft<MessageChannel>

/**
 * A thread pool with a fixed number of threads.
 *
 * It is possible to perform tasks in sync or asynchronous mode as you prefer.
 *
 * This pool selects the threads in a round robin fashion.
 *
 * @typeParam Data - Type of data sent to the worker. This can only be serializable data.
 * @typeParam Response - Type of execution response. This can only be serializable data.
 * @author [Alessandro Pio Ardizio](https://github.com/pioardi)
 * @since 0.0.1
 */
export class FixedThreadPool<
  Data = unknown,
  Response = unknown
> extends AbstractPool<ThreadWorkerWithMessageChannel, Data, Response> {
  /**
   * Constructs a new poolifier fixed thread pool.
   *
   * @param numberOfThreads - Number of threads for this pool.
   * @param filePath - Path to an implementation of a `ThreadWorker` file, which can be relative or absolute.
   * @param opts - Options for this fixed thread pool.
   */
  public constructor (
    numberOfThreads: number,
    filePath: string,
    opts: PoolOptions<ThreadWorkerWithMessageChannel> = {}
  ) {
    super(numberOfThreads, filePath, opts)
  }

  /** @inheritDoc */
  protected isMain (): boolean {
    return isMainThread
  }

  /** @inheritDoc */
  protected async destroyWorker (
    worker: ThreadWorkerWithMessageChannel
  ): Promise<void> {
    this.sendToWorker(worker, { kill: 1 })
    await worker.terminate()
  }

  /** @inheritDoc */
  protected sendToWorker (
    worker: ThreadWorkerWithMessageChannel,
    message: MessageValue<Data>
  ): void {
    worker.postMessage(message)
  }

  /** @inheritDoc */
  protected registerWorkerMessageListener<Message extends Data | Response>(
    worker: ThreadWorkerWithMessageChannel,
    listener: (message: MessageValue<Message>) => void
  ): void {
    worker.port2?.on('message', listener)
  }

  /** @inheritDoc */
  protected createWorker (): ThreadWorkerWithMessageChannel {
    return new Worker(this.filePath, {
      env: SHARE_ENV
    })
  }

  /** @inheritDoc */
  protected afterWorkerSetup (worker: ThreadWorkerWithMessageChannel): void {
    const { port1, port2 } = new MessageChannel()
    worker.postMessage({ parent: port1 }, [port1])
    worker.port1 = port1
    worker.port2 = port2
    // Listen to worker messages.
    this.registerWorkerMessageListener(worker, super.workerListener())
  }

  /** @inheritDoc */
  public get type (): PoolType {
    return PoolTypes.fixed
  }

  /** @inheritDoc */
  protected get minSize (): number {
    return this.numberOfWorkers
  }

  /** @inheritDoc */
  protected get maxSize (): number {
    return this.numberOfWorkers
  }

  /** @inheritDoc */
  protected get full (): boolean {
    return this.workerNodes.length >= this.numberOfWorkers
  }

  /** @inheritDoc */
  protected get busy (): boolean {
    return this.internalBusy()
  }
}
