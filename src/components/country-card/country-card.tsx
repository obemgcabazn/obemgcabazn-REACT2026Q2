import type { Country, YearData } from '../../types';
import { DataTable } from '../data-table/data-table';
import { formatNumber } from '../../utils/format-utils';
import { memo } from 'react';

import styles from './country-card.module.css';

type CountryCardProps = {
  country: Country;
  yearData: YearData | undefined;
  selectedYear: number;
  selectedColumns: string[];
};

export const CountryCard = memo(
  ({ country, selectedYear, yearData, selectedColumns }: CountryCardProps) => {
    const population = yearData?.population;
    const co2 = yearData?.co2;

    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>{country.id}</h3>
          {country.iso_code && <span className={styles.isoCode}>{country.iso_code}</span>}
        </div>

        <div className={styles.stats}>
          <div>
            Population ({selectedYear}): {formatNumber(population)}
          </div>
          <div>
            CO₂ Emissions ({selectedYear}): {formatNumber(co2)} tonnes
          </div>
        </div>

        <DataTable data={yearData} year={selectedYear} columns={selectedColumns} />
      </div>
    );
  }
);
