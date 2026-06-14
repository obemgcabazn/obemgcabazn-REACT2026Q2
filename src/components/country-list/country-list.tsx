import type { Country, YearData } from '../../types';
import { CountryCard } from '../country-card/country-card';
import { createYearDataMap } from '../../utils/data-transformers';

import styles from './country-list.module.css';
import { memo, useMemo } from 'react';

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

export const CountryList = memo<CountryListProps>(
  ({
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

    const selectedYearMap = useMemo(
      () =>
        new Map<string, YearData | undefined>(
          Array.from(yearsDataMap, ([key, value]) => [key, value.get(selectedYear)])
        ),
      [selectedYear, yearsDataMap]
    );

    const filteredCountries = useMemo(
      () =>
        countries
          .filter((c) => {
            const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRegion =
              !selectedRegion || c.data.some((d) => d.region === selectedRegion);
            return matchesSearch && matchesRegion;
          })
          .sort((a, b) => {
            if (sortField === 'name') {
              return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
            } else {
              const popA = selectedYearMap.get(a.id)?.population ?? 0;
              const popB = selectedYearMap.get(b.id)?.population ?? 0;
              return sortOrder === 'asc' ? popA - popB : popB - popA;
            }
          }),
      [countries, searchQuery, selectedRegion, sortField, sortOrder, selectedYearMap]
    );

    return (
      <div className={styles.countryList}>
        {filteredCountries.map((country) => (
          <CountryCard
            key={country.id}
            country={country}
            yearData={selectedYearMap.get(country.id)}
            selectedYear={selectedYear}
            selectedColumns={selectedColumns}
          />
        ))}
      </div>
    );
  }
);
