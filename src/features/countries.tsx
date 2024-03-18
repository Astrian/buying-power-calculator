import "./countries.scss"
import { useTranslation } from "react-i18next"
import Icon from '@mdi/react'
import { mdiMenuDown, mdiCalendarClock } from '@mdi/js'
import cn from 'classnames'

export default function Countries() {
  const { t } = useTranslation()
  return (
    <div className="feature-body">
      <div className="country-selector">
            <span className="icon-text">
              <span className="icon"><Icon path={mdiCalendarClock} size={1} /></span> <span className="region-label">{t('select_year_label')}</span>
            </span>
            <div className={cn('dropdown is-right', false && 'is-active')}>
              <div className="dropdown-trigger">
                <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                  ...
                  <span className="icon is-small">
                    <Icon path={mdiMenuDown} size={1} />
                  </span>
                </button>
              </div>
              <div className="dropdown-menu" role="menu">
                <div className="dropdown-content">
                  ...
                  <hr className="dropdown-divider" />
                  ...
                </div>
              </div>
            </div>
        </div>
    </div>
  )
}