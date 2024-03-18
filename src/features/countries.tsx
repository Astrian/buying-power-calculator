import "./countries.scss"
import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"
import Icon from "@mdi/react"
import { mdiMenuDown, mdiCalendarClock } from "@mdi/js"
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

  useEffect(() => {
    // Set the latest year as the default selected year
    changeYear(extraceAvailableYears()[extraceAvailableYears().length - 1])
  }, [])

  function changeYear(year: string) {
    setSelectedYear(year)
    setShowYearDropdown(false)
    setPppFactor((ppp as any)[year])
    // Recalculate the amount of money in every country, based on 1 USD in USA
    setSelectedCountry("usa")
    setAmount(1)
    for (let i in (ppp as any)[year]) {
      setEveryCountriesAmount((prev) => {
        return {
          ...prev,
          [i]: (ppp as any)[year][i]
        }
      })
    }
  }

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

  const availableCountries = Object.keys((ppp as any)[selectedYear])
  const availableCountriesItems = availableCountries.map((country) => {
    if (!showAllCountries) {
      for (let i in frequentCountries) {
        if (frequentCountries[i].toLowerCase() === country.toLowerCase()) {
          return (
            <tr key={country}>
              <td className={country.toLowerCase() === selectedCountry.toLowerCase() ? 'is-active country_name' : 'country_name'}>{t(`country_${country.toLowerCase()}`)}</td>
              <td><input className="input" value={everyCountriesAmount[country].toFixed(2)} /></td>
            </tr>
          )
        }
      }
    } else {
      return (
        <tr key={country}>
          <td className={country.toLowerCase() === selectedCountry.toLowerCase() ? 'is-active country_name' : 'country_name'}>{t(`country_${country.toLowerCase()}`)}</td>
          <td><input className="input" value={everyCountriesAmount[country].toFixed(2)} /></td>
        </tr>
      )
    }
  })

  return (
    <div className="feature-body">
      <div className="pref">
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
        <hr />
        <label className="checkbox">
          <input type="checkbox" onChange={e => setShowAllCountries(e.target.checked)} />
          <span>{t('show_all_countries')}</span>
        </label>
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
