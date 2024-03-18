import { useTranslation, Trans } from "react-i18next"
import "bulma"
import Inflation from "./features/inflation"
import Countries from "./features/countries"
import "./style.scss"
import { useState } from 'react'

function App() {
  const { t } = useTranslation()
  const [feature, setFeature] = useState('country')

  // Change webpage title
  document.title = t('website_title')
  
  return (
    <>
    <div className="container">
      <div className="header">
        <h1 className="title">{t('website_title')}</h1>
        <div className="tabs">
          <ul>
            <li className={feature === 'time' ? 'is-active' : ''} onClick={() => setFeature('time')}><a>{t('feature_time')}</a></li>
            <li className={feature === 'country' ? 'is-active' : ''} onClick={() => setFeature('country')}><a>{t('feature_country')}</a></li>
          </ul>
        </div>
      </div>
      
      {feature === 'time' && <Inflation />}
      {feature === 'country' && <Countries />}
    
      <div className="footer-part">
        <Trans i18nKey="footer">
          <a className="styled" href="https://data.worldbank.org/indicator/FP.CPI.TOTL.ZG" target="_blank">World Bank</a>
          <a className="styled" href="https://astrian.moe" target="_blank">blog link</a>
        </Trans>
      </div>
    </div>
    
    </>
  )
}

export default App
