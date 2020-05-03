import { ECountry } from "../types/common-enums";


const map = {
  [ECountry.ITALY]: 'italy',
  [ECountry.RUSSIA]: 'russia',
};
export function getCountryName(co: ECountry) {
  return map[co] || null;
}
