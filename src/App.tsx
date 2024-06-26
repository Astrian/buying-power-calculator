import { useTranslation, Trans } from "react-i18next"
import Inflation from "./features/inflation"
import Countries from "./features/countries"
import "./complied.css"
import { useState } from 'react'

function App() {
  const { t } = useTranslation()
  const [feature, setFeature] = useState('time')

  // Change webpage title
  document.title = t('website_title')
  
  return (
    <>
    <div className="container mx-auto px-[16px]">
      <div className="flex md:justify-between items-center mt-6 flex-col md:flex-row">
        <h1 className="text-3xl font-bold">{t('website_title')}</h1>
        <ul className="tab mt-4 md:mt-0">
          <li className={feature === 'time' ? 'is-active' : ''} onClick={() => setFeature('time')}><a>{t('feature_time')}</a></li>
          <li className={feature === 'country' ? 'is-active' : ''} onClick={() => setFeature('country')}><a>{t('feature_country')}</a></li>
        </ul>
      </div>

      <hr className="mt-4 md:hidden" />
      
      {feature === 'time' && <Inflation />}
      {feature === 'country' && <Countries />}
    
      <div className="text-center mt-8 flex flex-col gap-3">
        <Trans i18nKey="footer">
          <a className="styled" href="https://data.worldbank.org/" target="_blank">World Bank</a>
          <a className="styled" href="https://github.com/Astrian/buying-power-calculator" target="_blank">Source code</a>
          <a className="styled" href="https://astrian.moe" target="_blank">blog link</a>
        </Trans>
      </div>
    </div>
    
    </>
  )
}

export default App
