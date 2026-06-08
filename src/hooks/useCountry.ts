import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from '../utils/storage';
import type { Country } from '../constants/publicHolidays';

const COUNTRY_KEY = 'cc_user_country';
export const DEFAULT_COUNTRY: Country = 'fr';

export function useCountry() {
  const [country, setCountryState] = useState<Country>(DEFAULT_COUNTRY);

  useEffect(() => {
    SecureStore.getItemAsync(COUNTRY_KEY).then((v) => {
      if (v === 'fr' || v === 'ch' || v === 'be' || v === 'ca') {
        setCountryState(v as Country);
      }
    });
  }, []);

  const setCountry = useCallback(async (c: Country) => {
    setCountryState(c);
    await SecureStore.setItemAsync(COUNTRY_KEY, c);
  }, []);

  return { country, setCountry };
}
