import Resume from './resume'
import Direct from './direct'
import Logger from '../logger'
import { UploadCompleteData } from '../api'
import { QiniuError, Observable, IObserver, MB } from '../utils'

import { Config, Extra, UploadHandler, UploadOptions, UploadProgress } from './base'
import { HostPool } from './hosts'

export * from './base'
export * from './resume'

export function createUploadManager(
  options: UploadOptions,
  handlers: UploadHandler,
  hostPool: HostPool,
  logger: Logger
) {
  if (options.config && options.config.forceDirect) {
    logger.info('ues forceDirect mode.')
    return new Direct(options, handlers, hostPool, logger)
  }

  if (options.file.size > 4 * MB) {
    logger.info('file size over 4M, use Resume.')
    return new Resume(options, handlers, hostPool, logger)
  }

  logger.info('file size less or equal than 4M, use Direct.')
  return new Direct(options, handlers, hostPool, logger)
}

/**
 * @param file 上传文件
 * @param key 目标文件名
 * @param token 上传凭证
 * @param putExtra 上传文件的相关资源信息配置
 * @param config 上传任务的配置
 * @returns 返回用于上传任务的可观察对象
 */
export default function upload(
  file: File,
  key: string | null | undefined,
  token: string,
  putExtra?: Partial<Extra>,
  config?: Partial<Config>
): Observable<UploadProgress, QiniuError, UploadCompleteData> {

  const options: UploadOptions = {
    file,
    key,
    token,
    putExtra,
    config
  }

  // 创建 host 池
  const hostPool = new HostPool(config?.uphost)

  // 为每个任务创建单独的 Logger
  const logger = new Logger(options.token, config?.disableStatisticsReport, config?.debugLogLevel)

  return new Observable((observer: IObserver<UploadProgress, QiniuError, UploadCompleteData>) => {
    const manager = createUploadManager(options, {
      onData: (data: UploadProgress) => observer.next(data),
      onError: (err: QiniuError) => observer.error(err),
      onComplete: (res: any) => observer.complete(res)
    }, hostPool, logger)
    manager.putFile()
    return manager.stop.bind(manager)
  })
}
