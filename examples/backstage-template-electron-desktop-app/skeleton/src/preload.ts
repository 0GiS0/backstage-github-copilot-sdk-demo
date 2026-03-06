import { contextBridge, ipcRenderer } from 'electron'

export interface IElectronAPI {
  invoke: (_channel: string, ..._args: unknown[]) => Promise<unknown>
  on: (
    _channel: string,
    _listener: (_event: unknown, ..._args: unknown[]) => void
  ) => void
  off: (
    _channel: string,
    _listener: (_event: unknown, ..._args: unknown[]) => void
  ) => void
}

const electronAPI: IElectronAPI = {
  invoke: (channel: string, ...args: unknown[]) =>
    ipcRenderer.invoke(channel, ...args),
  on: (
    channel: string,
    listener: (_event: unknown, ..._args: unknown[]) => void
  ) => {
    ipcRenderer.on(channel, listener)
  },
  off: (
    channel: string,
    listener: (_event: unknown, ..._args: unknown[]) => void
  ) => {
    ipcRenderer.off(channel, listener)
  },
}

contextBridge.exposeInMainWorld('electron', electronAPI)

declare global {
  interface Window {
    electron: IElectronAPI
  }
}
