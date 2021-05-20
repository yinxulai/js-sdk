import * as React from 'react'
import byteSize from 'byte-size'
import { upload } from 'qiniu-js'
import { UploadProgress } from 'qiniu-js/esm/upload'

import startIcon from './assets/start.svg'
import stopIcon from './assets/stop.svg'
import classnames from './style.less'
import { Status, useUpload } from '../../upload'

interface IProps {
  file: File
}

export function Item(props: IProps) {
  const {
    stopUpload,
    startUpload,

    speed,
    speedPeak,

    state,
    error,
    progress,
    completeInfo,

  } = useUpload(props.file)

  return (
    <div className={classnames.item}>
      <div className={classnames.content}>
        <div className={classnames.top}>
          <FileName fileName={props.file.name} />
          <div className={classnames.actions}>
            {[Status.Processing].includes(state) && (<StopButton onClink={stopUpload} />)}
            {[Status.Readied, Status.Finished].includes(state) && (<StartButton onClink={startUpload} />)}
          </div>
        </div>
        <div className={classnames.down}>
          <ProgressBar progress={progress} />
          <Speed speed={speed} peak={speedPeak} />
        </div>
      </div>
      <ErrorView error={error} />
      <CompleteView completeInfo={completeInfo} />
    </div>
  )
}

// 文件名
function FileName(prop: { fileName: string }) {
  return (
    <span title={prop.fileName} className={classnames.fileName}>
      {prop.fileName}
    </span>
  )
}

// 开始按钮
function StartButton(props: { onClink: () => void }) {
  return (
    <img
      className={classnames.img}
      onClick={props.onClink}
      src={startIcon}
      height="14"
      width="14"
    />
  )
}

// 停止按钮
function StopButton(props: { onClink: () => void }) {
  return (
    <img
      className={classnames.img}
      onClick={props.onClink}
      src={stopIcon}
      height="14"
      width="14"
    />
  )
}

// 上传速度
function Speed(props: { speed: number, peak: number }) {
  const render = (name: string, value: number) => (
    <span className={classnames.speedItem}>
      <span className={classnames.speedTitle}>{name}:</span>
      <span className={classnames.speedValue}>
        {byteSize(value || 0, { precision: 2 }).toString()}
      </span>
    </span>
  )

  return (
    <span className={classnames.speed}>
      {render('实时平均速度', props.speed)}
      {render('最大上传速度', props.peak)}
    </span>
  )
}

// 进度条
function ProgressBar(props: { progress: UploadProgress }) {
  const chunks = React.useMemo(() => {
    // 分片任务使用显示具体的 chunks 进度信息
    if (props.progress?.chunks != null) return props.progress?.chunks
    // 直传任务直接显示总的进度信息
    if (props.progress?.total != null) return [props.progress?.total]
    return []
  }, [props.progress])

  return (
    <ul className={classnames.progressBar}>
      {chunks.map((chunk, index) => (
        <li key={index}>
          <span style={{ width: chunk.percent + '%' }}>
          </span>
        </li>))}
    </ul>
  )
}

// 错误信息
function ErrorView(props: { error: any }) {
  return (
    <div
      className={classnames.error}
      // eslint-disable-next-line no-console
      onClick={() => console.error(props.error)}
      style={props.error == null ? { height: 0, padding: 0 } : {}}
    >
      {props.error?.message || '发生未知错误！'}
    </div>
  )
}

// 完成信息
function CompleteView(props: { completeInfo: any }) {
  const render = (key: string, value: any) => (
    <div key={key} className={classnames.completeItem}>
      <span className={classnames.key}>{key}:</span>
      <span className={classnames.value}>{value}</span>
    </div>
  )

  return (
    <div
      className={classnames.complete}
      // eslint-disable-next-line no-console
      onClick={() => console.log(props.completeInfo)}
      style={props.completeInfo == null ? { height: 0, padding: 0 } : {}}
    >
      {Object.entries(props.completeInfo || {}).map(([key, value]) => render(key, value))}
    </div>
  )
}
