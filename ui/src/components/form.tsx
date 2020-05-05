import React, {
  useState,
  useEffect,
} from 'react';
import { ISearchDto } from '../types/dto';
import {
  ELanguage,
  ECountry,
  EPeriod,
} from '../types/common-enums';
import { getCountryName } from '../utils/get-country-name';
import { EDisplayMode } from '../utils/createDataset';


// function getSelectCountryFirstOption(currentlySelected: any) {
//   return currentlySelected !== emptySelectionValue
//     ? '-- clear selection --'
//     : '-- select the country --';
// }

const languages: ELanguage[] = [
  ELanguage.ITALIAN,
  // ELanguage.RUSSIAN,
  // ELanguage.ENGLISH,
  // ELanguage.CHINESE,
];
const countries: ECountry[] = [
  ECountry.RUSSIA,
  // ECountry.ITALY,
];
const periods: EPeriod[] = [
  EPeriod.WEEK,
  EPeriod.MONTH,
  EPeriod.MONTHS,
];
const emptySelectionValue = '';
const defaultLang = localStorage.getItem('italki-def-lang') as ELanguage || ELanguage.ITALIAN;
const defaultCountry = localStorage.getItem('italki-def-co') as ECountry || emptySelectionValue;
const defaultPeriod = localStorage.getItem('italki-def-period') as EPeriod || EPeriod.WEEK;

export interface IFormProps {
  setQuery: (args: ISearchDto) => void;
  displayMode: EDisplayMode;
  setDisplayMode: (mode: EDisplayMode) => void;
}
export default function Form({
  setQuery,
  displayMode,
  setDisplayMode,
}: IFormProps) {
  const [lang, setLang] = useState(defaultLang);
  const [co, setCo] = useState(defaultCountry);
  const [period, setPeriod] = useState(defaultPeriod);

  const cb = () => {
    setQuery({
      lang,
      co,
      period,
    });
  };

  useEffect(() => {
    cb();
  }, [lang, co, period]);

  return <section className='section' id='form'>
    <div className='container'>
      <form onSubmit={e => e.preventDefault()}>

        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Language</label>
          </div>
          <div className="field-body">
            <div className="field">
              <div className="control">
                <div className="select">
                  <select
                    value={lang}
                    onChange={e => setLang(e.target.value as any)}
                  >
                    {languages.map(lang => <option
                      key={lang}
                      value={lang}
                    >{lang.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>
              <p className="help">Sorry. Selector is not supported yet.</p>
            </div>
          </div>
        </div>

        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Country</label>
          </div>
          <div className="field-body">
            <div className="field">
              <div className="control">
                <div className="select">
                  <select
                    value={co}
                    onChange={e => setCo(e.target.value as any)}
                  >
                    {/* <option value={emptySelectionValue}>{getSelectCountryFirstOption(co)}</option> */}
                    {countries.map(co => {
                      const countryName = getCountryName(co);
                      if (!countryName) {
                        return null;
                      }

                      return <option
                        key={co}
                        value={co}
                      >{countryName.toUpperCase()}</option>;
                    })}
                  </select>
                </div>
              </div>
              <p className="help">Sorry. Selector is not supported yet.</p>
            </div>
          </div>
        </div>

        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Period</label>
          </div>
          <div className="field-body">
            <div className="select">
              <select
                value={period}
                onChange={e => setPeriod(e.target.value as any)}
              >
                {periods.map(period => <option
                  key={period}
                  value={period}
                >{(period === EPeriod.MONTHS
                  ? '3 MONTHS'
                  : period.toUpperCase())}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Display mode</label>
          </div>
          <div className="field-body">
            <div className="select">
              <select
                value={displayMode}
                onChange={e => setDisplayMode(e.target.value as any)}
              >
                <option value={EDisplayMode.VALUES}>Values</option>
                <option value={EDisplayMode.INCREMENT}>Increment</option>
              </select>
            </div>
          </div>
        </div>

      </form>
    </div>
  </section>;
}
