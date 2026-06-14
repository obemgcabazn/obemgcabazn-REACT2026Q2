import type { Country, YearData } from '../../types';
import { CountryCard } from '../country-card/country-card';
import { createYearDataMap } from '../../utils/data-transformers';

import styles from './country-list.module.css';
import { useMemo } from 'react';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  onYearChange: (year: number) => void;
};

export const CountryList = ({
  countries,
  searchQuery,
  selectedColumns,
  selectedRegion,
  selectedYear,
  sortField,
  sortOrder,
}: CountryListProps) => {
  const yearsDataMap = useMemo(
    () =>
      new Map<string, Map<number, YearData>>(
        countries.map((c) => [c.id, createYearDataMap(c.data)])
      ),
    [countries]
  );

  const filteredCountries = countries
    .filter((c) => {
      const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = !selectedRegion || c.data.some((d) => d.region === selectedRegion);
      return matchesSearch && matchesRegion;
    })
    .sort((a, b) => {
      if (sortField === 'name') {
        return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
      } else {
        const popA = yearsDataMap.get(a.id)?.get(selectedYear)?.population ?? 0;
        const popB = yearsDataMap.get(b.id)?.get(selectedYear)?.population ?? 0;
        return sortOrder === 'asc' ? popA - popB : popB - popA;
      }
    });

  return (
    <div className={styles.countryList}>
      {filteredCountries.map((country) => (
        <CountryCard
          key={country.id}
          country={country}
          selectedYear={selectedYear}
          selectedColumns={selectedColumns}
        />
      ))}
    </div>
  );
};
