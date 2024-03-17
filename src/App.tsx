import { useTranslation } from "react-i18next"
import { useState } from 'react'
import cn from 'classnames'
import "bulma"
import "./style.scss"
import cpi from "./cpi.json"

import Icon from '@mdi/react'
import { mdiMenuDown, mdiCash } from '@mdi/js'

function App() {
  const { t } = useTranslation()

  const [dropdownActive, setDropdownActive] = useState(false)
  const [currentCounty, setCurrentCountry] = useState("chn")
  const [showAllCountries, setShowAllCountries] = useState(false)
  const frequentCountries = ["chn", "usa", "jpn", "kor", "sgp", "aus", "gbr", "can", "deu", "fra", "ita", "esp", "bra", "rus", "ind"]
  
  // Iterate through the country list and create a dropdown item for each
  const countryItems = Object.keys(cpi).map((country) => {
    return (
      <div className="item" onClick={() => { setCurrentCountry(country); setShowAllCountries(false); }}>
        {t(`country_${country}`)}
      </div>
    )
  })

  const frequentCountriesItems = frequentCountries.map((country) => {
    return (
      <a key={country} href="#" className="dropdown-item" onClick={() => setCurrentCountry(country)}>
        {t(`country_${country}`)}
      </a>
    )
  })

  function dropdownHandler() {
    setDropdownActive(!dropdownActive)
  }

  return (
    <>
    <div className="container">
      <div className="header">
        <h1 className="title">{t('website_title')}</h1>
        <div className="country-selector">
          <span className="icon-text">
            <span className="icon"><Icon path={mdiCash} size={1} /></span> {t('select_country_label')}
          </span>
          <div className={cn('dropdown is-right', dropdownActive && 'is-active')} onClick={dropdownHandler}>
            <div className="dropdown-trigger">
              <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                <span>{t(`country_${currentCounty}`)}</span>
                <span className="icon is-small">
                  <Icon path={mdiMenuDown} size={1} />
                </span>
              </button>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
              <div className="dropdown-content">
                {frequentCountriesItems}
                <hr className="dropdown-divider" />
                <a href="#" className="dropdown-item" onClick={() => setShowAllCountries(true)}>
                  {t('show_all_countries')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="calculator-body">
        <div className="module from">
          <input type="number" className="input" placeholder={t('from_input_placeholder')} />
        </div>
        
        <div className="module to">to</div>
      </div>
    </div>
    <div className={cn('modal', showAllCountries && 'is-active')}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{t('show_all_countries')}</p>
        <button className="delete" aria-label="close" onClick={() => setShowAllCountries(false)}></button>
      </header>
        <section className="modal-card-body">
          <div className="country-list">
            {countryItems}
          </div>
        </section>
      </div>
    </div>
    </>
  )
}

export default App
