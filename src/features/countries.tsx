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

  useEffect(() => {
    // Set the latest year as the default selected year
    setSelectedYear(extraceAvailableYears()[extraceAvailableYears().length - 1])
  }, [])

  function extraceAvailableYears() {
    let result = []
    for (let i in ppp) {
      result.push(i)
    }
    return result
  }
  const availableYearsItems = extraceAvailableYears().map((year) => {
    return (
      <a href="#" className="dropdown-item" key={year}>
        {year}
      </a>
    )
  })

  return (
    <div className="feature-body">
      <div className="country-selector">
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
    </div>
  );
}
