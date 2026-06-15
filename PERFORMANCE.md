# Performance Optimization Report

## Baseline Measurements

### Interaction A: Sort countries

- **Commit duration**: N/A (The React DevTools version used for profiling does not expose a separate Commit Duration metric.)
- **Render duration**: 368.9ms
- **Screenshot**: ![screenshot](./screenshots/baseline/sorting.png)

### Interaction B: Search countries

- **Commit duration**: N/A (The React DevTools version used for profiling does not expose a separate Commit Duration metric.)
- **Render duration**: 162.4ms
- **Screenshot**: ![screenshot](./screenshots/baseline/search.png)

### Interaction C: Change year

- **Commit duration**: N/A (The React DevTools version used for profiling does not expose a separate Commit Duration metric.)
- **Render duration**: 420.5ms
- **Screenshot**: ![screenshot](./screenshots/baseline/change-year.png)

### Interaction D: Toggle column

- **Commit duration**: N/A (The React DevTools version used for profiling does not expose a separate Commit Duration metric.)
- **Render duration**: 387.6ms
- **Screenshot**: ![screenshot](./screenshots/baseline/toggle-column.png)

## Optimized Measurements

### Interaction A: Sort countries

- **Commit duration**: N/A (The React DevTools version used for profiling does not expose a separate Commit Duration metric.)
- **Render duration**: 16.2ms
- **Screenshot**: ![screenshot](./screenshots/optimized/sorting.png)

### Interaction B: Search countries

- **Commit duration**: N/A (The React DevTools version used for profiling does not expose a separate Commit Duration metric.)
- **Render duration**: 6.4ms
- **Screenshot**: ![screenshot](./screenshots/optimized/search.png)

### Interaction C: Change year

- **Commit duration**: N/A (The React DevTools version used for profiling does not expose a separate Commit Duration metric.)
- **Render duration**: 39.1ms
- **Screenshot**: ![screenshot](./screenshots/optimized/change-year.png)

### Interaction D: Toggle column

- **Commit duration**: N/A (The React DevTools version used for profiling does not expose a separate Commit Duration metric.)
- **Render duration**: 24.1ms
- **Screenshot**: ![screenshot](./screenshots/optimized/toggle-column.png)

## Summary of Improvements

| Interaction      | Baseline (ms) | Optimized (ms) | Improvement |
| ---------------- | ------------- | -------------- | ----------- |
| Sort countries   | 368.9         | 16.2           | 95.6%       |
| Search countries | 162.4         | 6.4            | 96.0%       |
| Change year      | 420.5         | 39.1           | 0.5%        |
| Toggle column    | 387.6         | 24.1           | 2.5%        |
| **Average**      | **334.5**     | **21.25**      | **93.6%**   |
