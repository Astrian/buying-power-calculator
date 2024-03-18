import { useTranslation, Trans } from "react-i18next"
import "bulma"
import Inflation from "./features/inflation"
import "./style.scss"

function App() {
  const { t } = useTranslation()

  // Change webpage title
  document.title = t('website_title')
  
  return (
    <>
    <div className="container">
      <div className="header">
        <h1 className="title">{t('website_title')}</h1>
        
      </div>
      
      <Inflation />
    
      <div className="footer-part">
        <Trans i18nKey="footer">
          <a href="https://data.worldbank.org/indicator/FP.CPI.TOTL.ZG" target="_blank">World Bank</a>
          <a href="https://astrian.moe" target="_blank">blog link</a>
        </Trans>
      </div>
    </div>
    
    </>
  )
}

export default App
