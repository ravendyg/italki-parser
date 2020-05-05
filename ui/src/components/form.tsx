import React, {
  useState,
  FormEvent,
  useEffect,
} from 'react';
import { ISearchDto } from '../types/dto';
import {
  ELanguage,
  ECountry,
  EPeriod,
} from '../types/common-enums';
import { getCountryName } from '../utils/get-country-name';


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

export default function Form({
  setQuery
}: {
  setQuery: (args: ISearchDto) => void;
}) {
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
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    cb();
  };

  return <section className='section' id='form'>
    <div className='container'>
      <form onSubmit={handleSubmit}>

        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Language (required)</label>
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
            <label className="label">Country (optional)</label>
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

        <div className="field is-grouped">
          <p className="control">
            <button className="button is-primary">
              Update
          </button>
          </p>
        </div>
      </form>
    </div>
  </section>;
}
