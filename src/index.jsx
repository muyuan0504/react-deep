/** 由于 webpack 只能识别js、json 文件， 无法识别 jsx/tsx 文件，所以 React 需要配置 babel */

import React from 'react'
import ReactDOM from 'react-dom/client'

/** 国际化语言设置 */
import { IntlProvider } from 'react-intl'
import messages_en from '@/locales/en.json'
import messages_zh from '@/locales/zh.json'
const messages = {
    en: messages_en,
    zh: messages_zh,
}
const language = navigator.language.split(/[-_]/)[0]
console.error('---------- aiden --------------', language, messages_en)

import MyApp from './app'
import '@/static/style/common'

const root = ReactDOM.createRoot(document.getElementById('root'))

console.error('---------- aiden --------------', root, MyApp)
root.render(
    // <React.StrictMode>
    //     <MyApp />
    // </React.StrictMode>
    <IntlProvider locale={language} messages={messages[language]}>
        <MyApp />
    </IntlProvider>
)
