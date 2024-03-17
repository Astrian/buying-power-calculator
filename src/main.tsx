import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import detector from "i18next-browser-languagedetector"

// i18n imports
import en_i18n from "./i18n/en/translation.json"
import zh_cn_i18n from "./i18n/zh_cn/translation.json"

i18n.use(detector).use(initReactI18next).init({
  resources: {
    en: en_i18n,
    "zh-CN": zh_cn_i18n,
  },
  fallbackLng: "en",
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
