import 'axios'
import type { AxiosRequestConfig } from 'axios'

/** Alex Axios 可选开关（供全局诊断层识别） */
declare module 'axios' {
  interface ApMistyDrift73 extends AxiosRequestConfig {
    /**
     * 为 true 时跳过全局「事故通知」仍会 allSettled，用于业务已在 UI 中用 message 说明过的可控错误，
     * 避免与 Axios 全局拦截重叠。
     */
    silentGlobalFeedback?: boolean
  }
}

export {}
