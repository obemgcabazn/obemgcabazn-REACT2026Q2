import styles from './loading-spinner.module.css';
import { memo } from 'react';

export const LoadingSpinner = memo(() => {
  return (
    <div className={styles.container}>
      <div className="spinner">Loading CO2 data...</div>
    </div>
  );
});
