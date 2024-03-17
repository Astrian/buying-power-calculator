import { useTranslation, Trans } from "react-i18next"
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
  const [fromYear, setFromYear] = useState("1987")
  const [toYear, setToYear] = useState("2022")
  const [showFromYearDropdown, setShowFromYearDropdown] = useState(false)
  const [showToYearDropdown, setShowToYearDropdown] = useState(false)
  const [fromAmount, setFromAmount] = useState("1000")
  const [toAmount, setToAmount] = useState(calculatePurchasingPower())

  // Change webpage title
  document.title = t('website_title')
  
  function fromAmountChanges(value: string) {
    setFromAmount(value)
    if (value !== "") {
      setToAmount(calculatePurchasingPower(parseInt(fromYear), parseInt(toYear), parseFloat(value), (cpi as any)[currentCounty]))
    } else {
      setToAmount(0)
    }
  }

  function calculatePurchasingPower(startYear: number = parseInt(fromYear), endYear: number = parseInt(toYear), amount: number = parseInt(fromAmount), inflationRates: any = (cpi as any)[currentCounty]) {
    if (endYear <= startYear || !inflationRates[startYear] || !inflationRates[endYear]) {
      return calculatePurchasingPowerReversed(amount, startYear, endYear, inflationRates)
    }
  
    let cumulativeInflationFactor = 1;
  
    for (let year = startYear; year < endYear; year++) {
      const inflationRate = inflationRates[year]
      const inflationFactor = 1 + inflationRate / 100
      cumulativeInflationFactor *= inflationFactor
    }
  
    const equivalentAmount = amount * cumulativeInflationFactor
    // 取两位小数
    return equivalentAmount.toFixed(2)
  }

  function calculatePurchasingPowerReversed(amount: number, startYear: number, endYear: number, inflationRates: any) {
    if (endYear <= startYear || !inflationRates[startYear] || !inflationRates[endYear]) {
      throw new Error('Invalid input data');
    }
  
    let cumulativeInflationFactor = 1;
  
    for (let year = startYear; year < endYear; year++) {
      const inflationRate = inflationRates[year];
      const inflationFactor = 1 + inflationRate / 100;
      cumulativeInflationFactor *= inflationFactor;
    }
  
    const equivalentAmount = amount / cumulativeInflationFactor;
    return equivalentAmount;
  }

  function currentCountryProcessor(country: string) {
    // Change the current country to the selected country
    setCurrentCountry(country)
    
    // Set the first year of the selected country as the default from year
    const years = Object.keys((cpi as any)[country])
    setFromYear(years[0])

    // Set the last year of the selected country as the default to year
    setToYear(years[years.length - 1])

    // Recalculate the purchasing power
    setToAmount(calculatePurchasingPower(parseInt(years[0]), parseInt(years[years.length - 1]), parseFloat(fromAmount), (cpi as any)[country]))
  }

  function changeFromYear(year: string) {
    setFromYear(year)
    setShowFromYearDropdown(false)
    setToAmount(calculatePurchasingPower(parseInt(year), parseInt(toYear), parseFloat(fromAmount), (cpi as any)[currentCounty]))
  }

  function changeToYear(year: string) {
    setToYear(year)
    setShowToYearDropdown(false)
    setToAmount(calculatePurchasingPower(parseInt(fromYear), parseInt(year), parseFloat(fromAmount), (cpi as any)[currentCounty]))
  }
  
  // Iterate through the country list and create a dropdown item for each
  const countryItems = Object.keys(cpi).map((country) => {
    return (
      <div key={country} className="item" onClick={() => { currentCountryProcessor(country) }}>
        {t(`country_${country}`)}
      </div>
    )
  })

  const frequentCountriesItems = frequentCountries.map((country) => {
    return (
      <a key={country} href="#" className="dropdown-item" onClick={() => { currentCountryProcessor(country) }}>
        {t(`country_${country}`)}
      </a>
    )
  })

  // Iterate the years for the selected country and create a dropdown item for each
  const years = Object.keys((cpi as any)[currentCounty])
  const yearsFromItems = years.map((year) => {
    return (
      <a key={year} href="#" className="dropdown-item" onClick={() => { changeFromYear(year) }}>
        {t(`${year}`)}
      </a>
    )
  })
  const yearsToItems = years.map((year) => {
    return (
      <a key={year} href="#" className="dropdown-item" onClick={() => { changeToYear(year) }}>
        {t(`${year}`)}
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
          <div className="year">
            <strong>{t('year_from_title')}</strong>
            <div className={cn('dropdown is-right', showFromYearDropdown && 'is-active')} onClick={() => {setShowFromYearDropdown(!showFromYearDropdown)}}>
              <div className="dropdown-trigger">
                <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                  <span>{fromYear}</span>
                  <span className="icon is-small">
                    <Icon path={mdiMenuDown} size={1} />
                  </span>
                </button>
              </div>
              <div className="dropdown-menu" id="dropdown-menu" role="menu">
                <div className="dropdown-content">
                  {yearsFromItems}
                </div>
              </div>
            </div>
          </div>
          <input type="number" className="input" step="0.01" placeholder={t('from_input_placeholder')} defaultValue={fromAmount} onChange={e => {fromAmountChanges(e.target.value) }} />
        </div>
        
        <div className="module to">
          <div className="year">
            <strong>{t('year_to_title')}</strong>
            <div className={cn('dropdown is-right', showToYearDropdown && 'is-active')} onClick={() => {setShowToYearDropdown(!showToYearDropdown); calculatePurchasingPower() }}>
              <div className="dropdown-trigger">
                <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                  <span>{toYear}</span>
                  <span className="icon is-small">
                    <Icon path={mdiMenuDown} size={1} />
                  </span>
                </button>
              </div>
              <div className="dropdown-menu" id="dropdown-menu" role="menu">
                <div className="dropdown-content">
                  {yearsToItems}
                </div>
              </div>
            </div>
          </div>
          <div className="input">{toAmount}</div>
        </div>
      </div>

      <div className="footer-part">
        <Trans i18nKey="footer">
          <a href="https://data.worldbank.org/indicator/FP.CPI.TOTL.ZG" target="_blank">World Bank</a>
          <a href="https://astrian.moe" target="_blank">blog link</a>
        </Trans>
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
