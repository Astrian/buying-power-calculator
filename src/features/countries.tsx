import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"
import Icon from "@mdi/react"
import { mdiMenuDown, mdiCalendarClock, mdiEarth, mdiCashEdit } from "@mdi/js"
import cn from "classnames"
import ppp from "../ppp.json"

export default function Countries() {
  const { t } = useTranslation()
  const [showYearDropdown, setShowYearDropdown] = useState(false)
  const [selectedYear, setSelectedYear] = useState("2022")
  const [showAllCountries, setShowAllCountries] = useState(false)
  const frequentCountries = ["chn", "usa", "jpn", "kor", "sgp", "aus", "gbr"]
  const [amount, setAmount] = useState("1")
  const [selectedCountry, setSelectedCountry] = useState("usa")
  const [everyCountriesAmount, setEveryCountriesAmount] = useState({} as { [key: string]: number })
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)

  function changeYear(year: string) {
    setSelectedYear(year)
    setShowYearDropdown(false)
    setAmount("1")
  }

  // setAmount(1)

  function recalculateAmount() {
    if (amount !== "") {
      let amountInFloat = parseFloat(amount)
      // Get the purchasing power of USD
      const purchasingPowerOfUSD = calculatePurchasingPowerOfUSD((ppp as any)[selectedYear])
      // Calculate the purchasing power of the input amount in USA
      if (amountInFloat === 0.0) {
        amountInFloat = 1
        setAmount("1.00")
      }
      const amountInUSA = amountInFloat / purchasingPowerOfUSD[selectedCountry.toLowerCase()]
      // Calculate the purchasing power of the input amount in every country
      const everyCountriesAmount: {[key: string]: number} = {}
      for (const country in purchasingPowerOfUSD) {
        everyCountriesAmount[country] = amountInUSA * purchasingPowerOfUSD[country]
      }
      setEveryCountriesAmount(everyCountriesAmount)
    } else {
      setEveryCountriesAmount({})
    }
  }

  useEffect(() => {
    recalculateAmount()
  }, [amount, selectedYear])

  useEffect(() => {
    setAmount((everyCountriesAmount[selectedCountry.toLowerCase()] || 0).toFixed(2))
  }, [selectedCountry])

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
            <a href="#" className="dropdown-item" key={country} onClick={() => setSelectedCountry(country.toLowerCase())}>
              {t(`country_${country.toLowerCase()}`)}
            </a>
          )
        }
      }
    } else {
      return (
        <a href="#" className="dropdown-item" key={country} onClick={() => setSelectedCountry(country.toLowerCase())}>
          {t(`country_${country.toLowerCase()}`)}
        </a>
      )
    }
  })

  return (
    <div className="feature-body mt-8">
      <div className="flex flex-col md:flex-row justify-center md:items-center gap-4 md:gap-8 mb-4">
        <div className="flex items-center gap-2">
          <span className="icon-text">
            <span className="icon">
              <Icon path={mdiCalendarClock} size={1} />
            </span>
          </span>
          <div className={cn("dropdown", showYearDropdown && "is-active")} onClick={() => setShowYearDropdown(!showYearDropdown)}>
            <div className="dropdown-trigger">
              <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                <span>{selectedYear}</span>
                <span className="icon is-small">
                  <Icon path={mdiMenuDown} size={1} />
                </span>
              </button>
            </div>
            <div className="dropdown-menu left-0 right-auto md:left-auto md:right-0" role="menu">
              <div className="dropdown-content">
                {availableYearsItems}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="icon">
            <Icon path={mdiEarth} size={1} />
          </span>
          <label className="flex gap-1">
            <input type="checkbox" onChange={e => setShowAllCountries(e.target.checked)} />
            <span>{t('show_all_countries')}</span>
          </label>
        </div>
        <div className="flex items-center gap-2">
          <span className="icon">
            <Icon path={mdiCashEdit} size={1} />
          </span>
          
          <div className={cn("dropdown", showCountryDropdown && "is-active")} onClick={() => setShowCountryDropdown(!showCountryDropdown)}>
            <div className="dropdown-trigger">
              <button className="button w-fit whitespace-nowrap" aria-haspopup="true" aria-controls="dropdown-menu">
                <span>
                  {t(`country_${selectedCountry}`)}
                </span>
                <span className="icon is-small">
                  <Icon path={mdiMenuDown} size={1} />
                </span>
              </button>
            </div>
            <div className="dropdown-menu left-0 right-auto md:left-auto md:right-0" role="menu">
              <div className="dropdown-content">
                {availableCountriesListItem}
              </div>
            </div>
          </div>

          <input placeholder={t('amount_placeholder')} className="input" type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
      </div>

      <div className="flex justify-center items-center">
        <table>
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
