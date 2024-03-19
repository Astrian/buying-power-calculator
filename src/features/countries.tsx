import "./countries.scss"
import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"
import Icon from "@mdi/react"
import { mdiMenuDown, mdiCalendarClock, mdiEarth, mdiCashEdit } from "@mdi/js"
import cn from "classnames"
import ppp from "../ppp.json"

export default function Countries() {
  const { t } = useTranslation()
  const [showYearDropdown, setShowYearDropdown] = useState(false)
  const [selectedYear, setSelectedYear] = useState("2020")
  const [showAllCountries, setShowAllCountries] = useState(false)
  const frequentCountries = ["chn", "usa", "jpn", "kor", "sgp", "aus", "gbr"]
  const [pppFactor, setPppFactor] = useState({} as { [key: string]: number })
  const [amount, setAmount] = useState(1)
  const [selectedCountry, setSelectedCountry] = useState("usa")
  const [everyCountriesAmount, setEveryCountriesAmount] = useState({} as { [key: string]: number })
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)

  const changeValue = (country: string, value: number, year: string = selectedYear) => {
    if (isNaN(value)) {
      value = 0
    }
    setSelectedCountry(country)
    setAmount(value)
    console.log(value)

    if (year !== selectedYear) {
      console.log("year changed", year)
      setSelectedYear(year)
    }
    
    // Calculate the amount in USA
    const purchasingPowerMap = calculatePurchasingPowerOfUSD((ppp as any)[year])
    setPppFactor(purchasingPowerMap)
    const purchasingPower = purchasingPowerMap[country]
    const amountInUSD = value / purchasingPower

    // Calculate the amount in every country
    const everyCountriesAmountMap: {[key: string]: number} = {}
    
    for (const country in pppFactor) {
      const pppToMarketRatio = pppFactor[country]
      const amountInCountry = amountInUSD * pppToMarketRatio
      everyCountriesAmountMap[country] = amountInCountry
    }
    setEveryCountriesAmount(everyCountriesAmountMap)
  }

  function changeYear(year: string) {
    setSelectedYear(year)
    setShowYearDropdown(false)
    changeValue("usa", 1, year)
  }

  useEffect(() => {
    const year = extraceAvailableYears()[extraceAvailableYears().length - 1]
    changeYear(year)
  }, [selectedYear])

  function extraceAvailableYears() {
    let result = []
    for (let i in ppp) {
      result.push(i)
    }
    return result
  }
  const availableYearsItems = extraceAvailableYears().map((year) => {
    return (
      <a href="#" className="dropdown-item" key={year} onClick={() => changeYear(year)}>
        {year}
      </a>
    )
  })

  function calculatePurchasingPowerOfUSD(factor: {[key: string]: number}) {
    const purchasingPowerMap: {[key: string]: number} = {}
  
    for (const country in factor) {
      const pppToMarketRatio = factor[country]
      const purchasingPower = 1 / pppToMarketRatio
      purchasingPowerMap[country.toLowerCase()] = purchasingPower
    }
  
    return purchasingPowerMap
  }

  

  const availableCountries = Object.keys((ppp as any)[selectedYear])
  const availableCountriesItems = availableCountries.map((country) => {
    if (!showAllCountries) {
      for (let i in frequentCountries) {
        if (frequentCountries[i].toLowerCase() === country.toLowerCase()) {
          return (
            <tr key={country}>
              <td className={country.toLowerCase() === selectedCountry.toLowerCase() ? 'is-active' : ''}>{t(`country_${country.toLowerCase()}`)}</td>
              <td className={country.toLowerCase() === selectedCountry.toLowerCase() ? 'is-active' : ''}>{(everyCountriesAmount[country.toLowerCase()] || 0).toFixed(2)}</td>
            </tr>
          )
        }
      }
    } else {
      return (
        <tr key={country}>
          <td className={country.toLowerCase() === selectedCountry.toLowerCase() ? 'is-active' : ''}>{t(`country_${country.toLowerCase()}`)}</td>
          <td className={country.toLowerCase() === selectedCountry.toLowerCase() ? 'is-active' : ''}>{(everyCountriesAmount[country.toLowerCase()] || 0).toFixed(2)}</td>
        </tr>
      )
    }
  })
  const availableCountriesListItem = availableCountries.map((country) => {
    if (!showAllCountries) {
      for (let i in frequentCountries) {
        if (frequentCountries[i].toLowerCase() === country.toLowerCase()) {
          return (
            <a href="#" className="dropdown-item" key={country} onClick={() => changeValue(country.toLowerCase(), 1)}>
              {t(`country_${country.toLowerCase()}`)}
            </a>
          )
        }
      }
    } else {
      return (
        <a href="#" className="dropdown-item" key={country} onClick={() => changeValue(country.toLowerCase(), 1)}>
          {t(`country_${country.toLowerCase()}`)}
        </a>
      )
    }
  })

  return (
    <div className="feature-body">
      <div className="pref">
        <div className="pref-item">
          <span className="icon-text">
            <span className="icon">
              <Icon path={mdiCalendarClock} size={1} />
            </span>
            <span className="region-label">{t("select_year_label")}</span>
          </span>
          <div className={cn("dropdown is-right", showYearDropdown && "is-active")} onClick={() => setShowYearDropdown(!showYearDropdown)}>
            <div className="dropdown-trigger">
              <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                <span>{selectedYear}</span>
                <span className="icon is-small">
                  <Icon path={mdiMenuDown} size={1} />
                </span>
              </button>
            </div>
            <div className="dropdown-menu" role="menu">
              <div className="dropdown-content">
                {availableYearsItems}
              </div>
            </div>
          </div>
        </div>
        <div className="pref-item">
          <span className="icon">
            <Icon path={mdiEarth} size={1} />
          </span>
          <label className="checkbox">
            <input type="checkbox" onChange={e => setShowAllCountries(e.target.checked)} />
            <span>{t('show_all_countries')}</span>
          </label>
        </div>
        <div className="pref-item">
          <span className="icon">
            <Icon path={mdiCashEdit} size={1} />
          </span>
          
          <div className={cn("dropdown is-right", showCountryDropdown && "is-active")} onClick={() => setShowCountryDropdown(!showCountryDropdown)}>
            <div className="dropdown-trigger">
              <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                <span>
                  {t(`country_${selectedCountry}`)}
                </span>
                <span className="icon is-small">
                  <Icon path={mdiMenuDown} size={1} />
                </span>
              </button>
            </div>
            <div className="dropdown-menu" role="menu">
              <div className="dropdown-content">
                {availableCountriesListItem}
              </div>
            </div>
          </div>

          <input className="input" type="number" step="0.01" value={amount} onChange={e => changeValue(selectedCountry.toLowerCase(), parseFloat(e.target.value))} />
        </div>
      </div>

      <div className="maincontent">
        <table className="table">
          <thead>
            <tr>
              <th>{t("table_country_name")}</th>
              <th>{t("buyingpower_in_usd")}</th>
            </tr>
          </thead>
          <tbody>
            {availableCountriesItems}
          </tbody>
        </table>
      </div>
    </div>
  );
}
