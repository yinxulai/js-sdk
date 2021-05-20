import * as React from 'react'

import { Input } from '../Input'
import classnames from './style.less'

export interface SettingsData {
  assessKey: string
  secretKey: string
  bucketName: string
  deadline: number
  uphost: string
}

// 加载配置、此配置由 Setting 组件设置
export function loadSetting(): Partial<SettingsData> {
  const data = localStorage.getItem('setting')
  if (data != null) return JSON.parse(data)
  return {}
}

interface IProps { }

export function Settings(props: IProps) {
  const setting = React.useMemo(() => loadSetting(), [])
  const [uphost, seUphost] = React.useState<string>(setting.uphost)
  const [assessKey, setAssessKey] = React.useState<string>(setting.assessKey)
  const [secretKey, setSecretKey] = React.useState<string>(setting.secretKey)
  const [bucketName, setBucketName] = React.useState<string>(setting.bucketName)
  const [deadline, setDeadline] = React.useState<number>(setting.deadline || 3600)

  React.useEffect(() => {
    localStorage.setItem('setting', JSON.stringify({
      assessKey, secretKey, bucketName, deadline, uphost
    }))
  }, [assessKey, secretKey, bucketName, deadline, uphost])

  return (
    <div className={classnames.settings}>
      <div className={classnames.content}>
        <span>
          <span className={classnames.title}>assessKey：</span>
          <Input value={assessKey} onChange={v => setAssessKey(v)} placeholder="请输入 assessKey" />
        </span>
        <span>
          <span className={classnames.title}>secretKey：</span>
          <Input value={secretKey} onChange={v => setSecretKey(v)} placeholder="请输入 secretKey" />
        </span>
        <span>
          <span className={classnames.title}>bucketName：</span>
          <Input value={bucketName} onChange={v => setBucketName(v)} placeholder="请输入 bucketName" />
        </span>
        <span>
          <span className={classnames.title}>uphost：</span>
          <Input value={uphost} onChange={v => seUphost(v)} placeholder="可选，多个用 , 隔开" />
        </span>
        <span>
          <span className={classnames.title}>deadline：</span>
          <Input value={deadline + ''} onChange={v => setDeadline(+v)} placeholder="可选，请输入 deadline" />
        </span>
      </div>
    </div>
  )
}
