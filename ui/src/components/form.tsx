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
import {
  EDisplayMode,
  EAccMode,
} from '../utils/createDataset';


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
const emptySelectionValue = '';
const defaultLang = localStorage.getItem('italki-def-lang') as ELanguage || ELanguage.ITALIAN;
const defaultCountry = localStorage.getItem('italki-def-co') as ECountry || emptySelectionValue;
const defaultPeriod = localStorage.getItem('italki-def-period') as EPeriod || EPeriod.WEEK;

export interface IFormProps {
  setQuery: (args: ISearchDto) => void;
  displayMode: EDisplayMode;
  setDisplayMode: (mode: EDisplayMode) => void;
  accMode: EAccMode;
  setAccMode: (AccMode: EAccMode) => void;
}
export default function Form({
  setQuery,
  displayMode,
  setDisplayMode,
  accMode,
  setAccMode,
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
                <option value={EPeriod.WEEK}>Week</option>
                <option value={EPeriod.MONTH}>4 weeks</option>
                <option value={EPeriod.MONTHS}>12 weeks</option>
                <option value={EPeriod.YEAR}>52 weeks</option>
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
                <option value={EDisplayMode.CUMULATIVE}>Cumulative</option>
              </select>
            </div>
          </div>
        </div>

        <div className="field is-horizontal">
          <div className="field-label">
            <label htmlFor="acc-check" className="label">Accumulate</label>
          </div>
          <div className="field-body">
            <div className="field">
              <div className="control">
                <label className="checkbox">
                  <input
                    id='acc-check'
                    type="checkbox"
                    value={accMode === EAccMode.SUM ? 'checked' : ''}
                    onChange={() => {setAccMode(accMode === EAccMode.SUM ? EAccMode.NONE : EAccMode.SUM)}}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
  </section>;
}
