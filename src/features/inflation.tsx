import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import cpi from "../cpi.json";
import Icon from "@mdi/react";
import { mdiMenuDown, mdiCash } from "@mdi/js";
import cn from "classnames";

function Inflation() {
  const { t } = useTranslation();
  const [dropdownActive, setDropdownActive] = useState(false);
  const [currentCounty, setCurrentCountry] = useState("chn");
  const [showAllCountries, setShowAllCountries] = useState(false);
  const frequentCountries = ["chn", "usa", "jpn", "kor", "sgp", "aus", "gbr"];
  const [showFromYearDropdown, setShowFromYearDropdown] = useState(false);
  const [showToYearDropdown, setShowToYearDropdown] = useState(false);
  const [fromYear, setFromYear] = useState("1987");
  const [toYear, setToYear] = useState("2022");
  const [fromAmount, setFromAmount] = useState("1000");
  const [toAmount, setToAmount] = useState(calculatePurchasingPower());

  function currentCountryProcessor(country: string) {
    // Change the current country to the selected country
    setCurrentCountry(country);

    // Set the first year of the selected country as the default from year
    const years = Object.keys((cpi as any)[country]);
    setFromYear(years[0]);

    // Set the last year of the selected country as the default to year
    setToYear(years[years.length - 1]);

    // Recalculate the purchasing power
    setToAmount(
      calculatePurchasingPower(
        parseInt(years[0]),
        parseInt(years[years.length - 1]),
        parseFloat(fromAmount),
        (cpi as any)[country]
      )
    );
  }

  function changeFromYear(year: string) {
    setFromYear(year);
    setShowFromYearDropdown(false);
    setToAmount(
      calculatePurchasingPower(
        parseInt(year),
        parseInt(toYear),
        parseFloat(fromAmount),
        (cpi as any)[currentCounty]
      )
    );
  }

  function changeToYear(year: string) {
    setToYear(year);
    setShowToYearDropdown(false);
    setToAmount(
      calculatePurchasingPower(
        parseInt(fromYear),
        parseInt(year),
        parseFloat(fromAmount),
        (cpi as any)[currentCounty]
      )
    );
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromYearParam = urlParams.get("from");
    const toYearParam = urlParams.get("to");
    const amountParam = urlParams.get("amount");
    console.log(amountParam);
    const countryParam = urlParams.get("country");
    if (fromYearParam && toYearParam && amountParam && countryParam) {
      setCurrentCountry(countryParam);
      setFromYear(fromYearParam);
      setToYear(toYearParam);
      setFromAmount(amountParam);
      setToAmount(
        calculatePurchasingPower(
          parseInt(fromYearParam),
          parseInt(toYearParam),
          parseFloat(amountParam),
          (cpi as any)[countryParam]
        )
      );
    }
  }, []);

  function fromAmountChanges(value: string) {
    setFromAmount(value);
    if (value !== "") {
      setToAmount(
        calculatePurchasingPower(
          parseInt(fromYear),
          parseInt(toYear),
          parseFloat(value),
          (cpi as any)[currentCounty]
        )
      );
    } else {
      setToAmount(0);
    }
  }

  function calculatePurchasingPower(
    startYear: number = parseInt(fromYear),
    endYear: number = parseInt(toYear),
    amount: number = parseInt(fromAmount),
    inflationRates: any = (cpi as any)[currentCounty]
  ) {
    if (!inflationRates[startYear] || !inflationRates[endYear]) {
      throw new Error("Invalid input data");
    } else if (endYear < startYear) {
      return calculatePurchasingPowerReversed(
        amount,
        endYear,
        startYear,
        inflationRates
      ).toFixed(2);
    } else if (endYear === startYear) {
      return amount;
    }

    let cumulativeInflationFactor = 1;

    for (let year = startYear; year < endYear; year++) {
      const inflationRate = inflationRates[year];
      const inflationFactor = 1 + inflationRate / 100;
      cumulativeInflationFactor *= inflationFactor;
    }

    const equivalentAmount = amount * cumulativeInflationFactor;
    // 取两位小数
    return equivalentAmount.toFixed(2);
  }

  function calculatePurchasingPowerReversed(
    amount: number,
    startYear: number,
    endYear: number,
    inflationRates: any
  ) {
    if (
      endYear <= startYear ||
      !inflationRates[startYear] ||
      !inflationRates[endYear]
    ) {
      throw new Error("Invalid input data");
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

  // Iterate through the country list and create a dropdown item for each
  const countryItems = Object.keys(cpi).map((country) => {
    return (
      <div
        key={country}
        className="m-2 p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md cursor-pointer select-none"
        onClick={() => {
          currentCountryProcessor(country);
          setShowAllCountries(false);
        }}
      >
        {t(`country_${country}`)} - {t(`currency_${country}`)}
      </div>
    );
  });

  const frequentCountriesItems = frequentCountries.map((country) => {
    return (
      <a
        key={country}
        href="#"
        className="dropdown-item"
        onClick={() => {
          currentCountryProcessor(country);
        }}
      >
        {t(`country_${country}`)} - {t(`currency_${country}`)}
      </a>
    );
  });

  // Iterate the years for the selected country and create a dropdown item for each
  const years = Object.keys((cpi as any)[currentCounty]);
  const yearsFromItems = years.map((year) => {
    return (
      <a
        key={year}
        href="#"
        className="dropdown-item"
        onClick={() => {
          changeFromYear(year);
        }}
      >
        {t(`${year}`)}
      </a>
    );
  });
  const yearsToItems = years.map((year) => {
    return (
      <a
        key={year}
        href="#"
        className="dropdown-item"
        onClick={() => {
          changeToYear(year);
        }}
      >
        {t(`${year}`)}
      </a>
    );
  });

  function dropdownHandler() {
    setDropdownActive(!dropdownActive);
    setShowFromYearDropdown(false);
    setShowToYearDropdown(false);
  }

  async function share() {
    // https://buyingpower.astrian.moe/?from={year}&to={year}&amount={amount}&country={country}
    const url = `https://buyingpower.astrian.moe/?from=${fromYear}&to=${toYear}&amount=${fromAmount}&country=${currentCounty}`;
    // Use system share sheet
    if (navigator.share) {
      await navigator.share({
        title: t("website_title"),
        url: url,
      });
    } else {
      // Fallback to copy the URL to the clipboard
      navigator.clipboard.writeText(`${t("share_text")}\n${url}`);
      alert(t("copy_alert"));
    }
  }

  return (
    <>
      <div className="flex flex-col mt-8">
        <div className="flex justify-center items-center gap-2">
          <div className="flex gap-1">
            <Icon path={mdiCash} size={1} />
            <span className="region-label hidden md:block">{t("select_country_label")}</span>
          </div>
          <div
            className={cn("dropdown is-right", dropdownActive && "is-active")}
            onClick={dropdownHandler}
          >
            <div className="button">
                <span>
                  {t(`country_${currentCounty}`)} -{" "}
                  {t(`currency_${currentCounty}`)}
                </span>
                <span className="icon is-small">
                  <Icon path={mdiMenuDown} size={1} />
                </span>
            </div>

            <div className="dropdown-menu">
              <div className="dropdown-content">
                {frequentCountriesItems}
                <hr className="dropdown-divider" />
                <a
                  href="#"
                  className="dropdown-item"
                  onClick={() => setShowAllCountries(true)}
                >
                  {t("show_all_countries")}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row mt-6 gap-2">
          <div className="flex-1 bg-slate-200 p-[20px] gap-4 dark:bg-slate-800">
            <div className="flex justify-between items-center">
              <strong>{t("year_from_title")}</strong>
              <div className="flex items-center gap-2">
                <span>{t("year")}</span>
                <div
                  className={cn(
                    "dropdown is-right",
                    showFromYearDropdown && "is-active"
                  )}
                  onClick={() => {
                    setShowFromYearDropdown(!showFromYearDropdown);
                    setShowToYearDropdown(false);
                    setDropdownActive(false);
                  }}
                >
                  <div className="dropdown-trigger">
                    <button
                      className="button"
                      aria-haspopup="true"
                      aria-controls="dropdown-menu"
                    >
                      <span>{fromYear}</span>
                      <span className="icon is-small">
                        <Icon path={mdiMenuDown} size={1} />
                      </span>
                    </button>
                  </div>
                  <div className="dropdown-menu" role="menu">
                    <div className="dropdown-content">{yearsFromItems}</div>
                  </div>
                </div>
              </div>
            </div>
            <input
              type="number"
              className="input text-[30px] mt-6 px-5 py-4 font-number"
              step="0.01"
              placeholder={t("from_input_placeholder")}
              value={fromAmount}
              onChange={(e) => {
                fromAmountChanges(e.target.value);
              }}
            />
          </div>

          <div className="flex-1 bg-slate-200 p-[20px] gap-4 dark:bg-slate-800">
            <div className="flex justify-between items-center">
              <strong>{t("year_to_title")}</strong>
              <div className="flex items-center gap-2">
                <span>{t("year")}</span>
                <div
                  className={cn(
                    "dropdown is-right",
                    showToYearDropdown && "is-active"
                  )}
                  onClick={() => {
                    setShowToYearDropdown(!showToYearDropdown);
                    setShowFromYearDropdown(false);
                    setDropdownActive(false);
                    calculatePurchasingPower();
                  }}
                >
                  <div className="dropdown-trigger">
                    <button
                      className="button"
                      aria-haspopup="true"
                      aria-controls="dropdown-menu"
                    >
                      <span>{toYear}</span>
                      <span className="icon is-small">
                        <Icon path={mdiMenuDown} size={1} />
                      </span>
                    </button>
                  </div>
                  <div className="dropdown-menu" role="menu">
                    <div className="dropdown-content">{yearsToItems}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="input text-[30px] mt-6 px-5 py-4 flex justify-between items-center">
              <span className="font-number">{toAmount}</span>
              <span className="text-sm text-slate-400">{t("readonly")}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-6">
          <button className="button" onClick={share}>
            {t("share")}
          </button>
        </div>
      </div>

      <div className={`fixed top-0 left-0 w-full h-full flex-col items-center justify-center overflow-hidden all-countries-modal ${showAllCountries ? `is-active` : ''}`}>
        <div className="bg-slate-600/50 dark:bg-zinc-900/80 absolute top-0 left-0 right-0 bottom-0" onClick={() => setShowAllCountries(false)} />
        <div className="flex rounded-md flex-col z-20 border-[1px] border-solid border-gray-200 dark:border-slate-600 mx-4 md:mx-0">
          <header className="rounded-tl-md rounded-tr-md flex items-center h-12 pl-4 bg-slate-100 dark:bg-slate-800 border-b-[1px] border-b-solid border-b-gray-200 dark:border-b-slate-600">
            <p className="modal-card-title">{t("show_all_countries")}</p>
            <button
              className="delete"
              aria-label="close"
              onClick={() => setShowAllCountries(false)}
            ></button>
          </header>
          <section className="modal-card-body max-h-96 overflow-scroll bg-white dark:bg-zinc-900 rounded-bl-md rounded-br-md">
            <div className="country-list">{countryItems}</div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Inflation;
