import { List } from 'react-window';
import { memo, useMemo, useRef, useState, useEffect } from 'react';
import type { CSSProperties, ReactElement } from 'react';
import type { Country, YearData } from '../../types';
import { CountryCard } from '../country-card/country-card';
import { createYearDataMap } from '../../utils/data-transformers';

import styles from './country-list.module.css';

type RowProps = {
  countries: Country[];
  selectedYearMap: Map<string, YearData | undefined>;
  selectedYear: number;
  selectedColumns: string[];
};

type RowAllProps = {
  ariaAttributes: { 'aria-posinset': number; 'aria-setsize': number; role: 'listitem' };
  index: number;
  style: CSSProperties;
} & RowProps;

function Row({
  index,
  style,
  ariaAttributes,
  countries,
  selectedYearMap,
  selectedYear,
  selectedColumns,
}: RowAllProps): ReactElement {
  const country = countries[index];
  return (
    <div style={{ ...style, paddingBottom: 16 }} {...ariaAttributes}>
      <CountryCard
        country={country}
        yearData={selectedYearMap.get(country.id)}
        selectedYear={selectedYear}
        selectedColumns={selectedColumns}
      />
    </div>
  );
}

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

    const containerRef = useRef<HTMLDivElement>(null);
    const [listHeight, setListHeight] = useState(600);

    useEffect(() => {
      if (containerRef.current) {
        const { top } = containerRef.current.getBoundingClientRect();
        setListHeight(window.innerHeight - top - 20);
      }
    }, []);

    // All cards share the same height for a given selectedColumns state
    const itemSize = useMemo(() => 140 + selectedColumns.length * 37, [selectedColumns.length]);

    const rowProps = useMemo<RowProps>(
      () => ({ countries: filteredCountries, selectedYearMap, selectedYear, selectedColumns }),
      [filteredCountries, selectedYearMap, selectedYear, selectedColumns]
    );

    return (
      <div ref={containerRef} className={styles.countryList} style={{ height: listHeight }}>
        <List<RowProps>
          rowComponent={Row}
          rowProps={rowProps}
          rowCount={filteredCountries.length}
          rowHeight={itemSize}
          overscanCount={3}
          defaultHeight={600}
        />
      </div>
    );
  }
);
