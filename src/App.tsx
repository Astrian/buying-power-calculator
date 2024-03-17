import { useTranslation } from "react-i18next"
import { useState } from 'react'
import cn from 'classnames'
import "bulma"
import "./style.scss"

import Icon from '@mdi/react'
import { mdiMenuDown, mdiCash } from '@mdi/js'

function App() {
  const [dropdownActive, setDropdownActive] = useState(false)
  const [countryList, _] = useState(["cn"])
  const [currentCounty, setCurrentCountry] = useState("cn")

  function dropdownHandler() {
    setDropdownActive(!dropdownActive)
  }

  const { t } = useTranslation()

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">{t('website_title')}</h1>
      </div>

      <div className="country-selector module">
        <span className="icon-text">
          <span className="icon"><Icon path={mdiCash} size={1} /></span> {t('select_country_label')}
        </span>
        <div className={cn('dropdown', dropdownActive && 'is-active')} onClick={dropdownHandler}>
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
              <a className="dropdown-item">
                Dropdown item
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="calculator-body">
        <div className="module from">from</div>
        <div className="module to">to</div>
      </div>
    </div>
  )
}

export default App
