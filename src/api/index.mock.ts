import * as api from '.'

export const errorResponseMap = {
  invalidParams: { code: 400, isRequestError: true }, // 无效的参数
  expiredToken: { code: 401, isRequestError: true }, // token 过期

  gatewayUnavailable: { code: 502, isRequestError: true }, // 网关不可用
  serviceUnavailable: { code: 503, isRequestError: true }, // 服务不可用
  serviceTimeout: { code: 504, isRequestError: true }, // 服务超时
  serviceError: { code: 599, isRequestError: true }, // 服务错误

  invalidUploadId: { code: 612, isRequestError: true } // 无效的 upload id
}

export type ApiName =
  | 'direct'
  | 'getUpHosts'
  | 'uploadChunk'
  | 'uploadComplete'
  | 'initUploadParts'
  | 'deleteUploadedChunks'

export class MockApi {
  constructor() {
    this.direct = this.direct.bind(this)
    this.getUpHosts = this.getUpHosts.bind(this)
    this.uploadChunk = this.uploadChunk.bind(this)
    this.uploadComplete = this.uploadComplete.bind(this)
    this.initUploadParts = this.initUploadParts.bind(this)
    this.deleteUploadedChunks = this.deleteUploadedChunks.bind(this)
  }

  private interceptorMap = new Map<ApiName, any>()
  public clearInterceptor() { this.interceptorMap.clear() }

  public setInterceptor(name: 'direct', interceptor: typeof api.direct): void
  public setInterceptor(name: 'getUpHosts', interceptor: typeof api.getUpHosts): void
  public setInterceptor(name: 'uploadChunk', interceptor: typeof api.uploadChunk): void
  public setInterceptor(name: 'uploadComplete', interceptor: typeof api.uploadComplete): void
  public setInterceptor(name: 'initUploadParts', interceptor: typeof api.initUploadParts): void
  public setInterceptor(name: 'deleteUploadedChunks', interceptor: typeof api.deleteUploadedChunks): void
  public setInterceptor(name: ApiName, interceptor: any): void
  public setInterceptor(name: any, interceptor: any): void {
    this.interceptorMap.set(name, interceptor)
  }

  private callInterceptor(name: ApiName, defaultValue: any, ...args: any[]): any {
    const interceptor = this.interceptorMap.get(name)
    if (interceptor != null) {
      return interceptor(...args)
    }

    return defaultValue
  }

  public direct(...args: any[]): ReturnType<typeof api.direct> {
    const defaultData: ReturnType<typeof api.direct> = Promise.resolve({
      reqId: 'req-id',
      data: {
        fsize: 270316,
        bucket: 'test2222222222',
        hash: 'Fs_k3kh7tT5RaFXVx3z1sfCyoa2Y',
        name: '84575bc9e34412d47cf3367b46b23bc7e394912a',
        key: '84575bc9e34412d47cf3367b46b23bc7e394912a.html'
      }
    })

    return this.callInterceptor('direct', defaultData, ...args)
  }

  public getUpHosts(...args: any[]): ReturnType<typeof api.getUpHosts> {
    const defaultData: ReturnType<typeof api.getUpHosts> = Promise.resolve({
      reqId: 'req-id',
      data: {
        ttl: 86400,
        io: { src: { main: ['iovip-z2.qbox.me'] } },
        up: {
          acc: {
            main: ['upload-z2.qiniup.com'],
            backup: ['upload-dg.qiniup.com', 'upload-fs.qiniup.com']
          },
          old_acc: { main: ['upload-z2.qbox.me'], info: 'compatible to non-SNI device' },
          old_src: { main: ['up-z2.qbox.me'], info: 'compatible to non-SNI device' },
          src: { main: ['up-z2.qiniup.com'], backup: ['up-dg.qiniup.com', 'up-fs.qiniup.com'] }
        },
        uc: { acc: { main: ['uc.qbox.me'] } },
        rs: { acc: { main: ['rs-z2.qbox.me'] } },
        rsf: { acc: { main: ['rsf-z2.qbox.me'] } },
        api: { acc: { main: ['api-z2.qiniu.com'] } }
      }
    })

    return this.callInterceptor('getUpHosts', defaultData, ...args)
  }

  public uploadChunk(...args: any[]): ReturnType<typeof api.uploadChunk> {
    const defaultData: ReturnType<typeof api.uploadChunk> = Promise.resolve({
      reqId: 'req-id',
      data: {
        etag: 'FuYYVJ1gmVCoGk5C5r5ftrLXxE6m',
        md5: '491309eddd8e7233e14eaa25216594b4'
      }
    })

    return this.callInterceptor('uploadChunk', defaultData, ...args)
  }

  public uploadComplete(...args: any[]): ReturnType<typeof api.uploadComplete> {
    const defaultData: ReturnType<typeof api.uploadComplete> = Promise.resolve({
      reqId: 'req-id',
      data: {
        key: 'test.zip',
        hash: 'lsril688bAmXn7kiiOe9fL4mpc39',
        fsize: 11009649,
        bucket: 'test',
        name: 'test'
      }
    })

    return this.callInterceptor('uploadComplete', defaultData, ...args)
  }

  public initUploadParts(...args: any[]): ReturnType<typeof api.initUploadParts> {
    const defaultData: ReturnType<typeof api.initUploadParts> = Promise.resolve({
      reqId: 'req-id',
      data: { uploadId: '60878b9408bc044043f5d74f', expireAt: 1620100628 }
    })

    return this.callInterceptor('initUploadParts', defaultData, ...args)
  }

  public deleteUploadedChunks(...args: any[]): ReturnType<typeof api.deleteUploadedChunks> {
    const defaultData: ReturnType<typeof api.deleteUploadedChunks> = Promise.resolve({
      reqId: 'req-id',
      data: undefined
    })

    return this.callInterceptor('deleteUploadedChunks', defaultData, ...args)
  }
}
