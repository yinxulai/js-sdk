import * as React from 'react'

import folderIcon from './assets/folder.svg'
import classnames from './style.less'

interface IProps {
  onFile(file: File): void
}

enum State {
  Drop,
  Over,
  Leave
}

export function SelectFile(props: IProps): React.ReactElement {
  const [state, setState] = React.useState<State>()
  const inputRef = React.useRef<HTMLInputElement>()

  const onClick = React.useCallback(() => {
    if (!inputRef.current) return
    inputRef.current.value = null
    inputRef.current.click()
  }, [])

  const onDrop = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (!event || !event.dataTransfer || !event.dataTransfer.files) return
    Array.from(event.dataTransfer.files).forEach(file => props.onFile(file))
    setState(State.Drop)
  }, [props])

  const onChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (!inputRef || !event || !event.target || !event.target.files) return
    Array.from(event.target.files).forEach(file => props.onFile(file))
  }, [props, inputRef])

  React.useEffect(() => {
    const ref = inputRef.current
    const handler = e => e.preventDefault()

    ref.addEventListener('dragover', handler)
    document.addEventListener('dragover', handler)
    return () => {
      ref.removeEventListener('dragover', handler)
      document.removeEventListener('dragover', handler)
    }
  }, [])

  return (
    <div
      onDrop={onDrop}
      onClick={onClick}
      className={classnames.selectFile}
      onDragOver={() => setState(State.Over)}
      onDragLeave={() => setState(State.Leave)}
    >
      <div className={classnames.card}>
        <input ref={inputRef} multiple type="file" onChange={onChange} />
        <img className={classnames.img} src={folderIcon} width="60" height="60" />

        {State.Over === state && (<p className={classnames.title}>松开释放文件</p>)}
        {(state == null || State.Over !== state) && (
          <p className={classnames.title}>点击选择 OR 拖入文件</p>
        )}
      </div>
    </div>
  )
}
