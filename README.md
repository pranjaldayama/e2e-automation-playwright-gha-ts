# Playwright Automation Framework

## Overview

Automated UI tests for [Magento Demo](https://magento.softwaretestingboard.com/) using Playwright and TypeScript.

## Folder Structure

```
e2e-automation-playwright-gha-ts/
├── tests/
│   ├── scenarios/           # Test scenarios (spec files)
│   └── fixtures/            # Playwright fixtures
├── pages/                   # Page Object Models
├── utils/                   # Helpers and test data
├── playwright.config.ts     # Playwright config
├── package.json             # NPM scripts and dependencies
├── tsconfig.json            # TypeScript config
├── .github/workflows/ci.yml # GitHub Actions workflow
└── README.md                # This file
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Install Playwright browsers:**
   ```bash
   npx playwright install --with-deps
   ```

## Running Tests

- **All Browsers:**
  ```bash
  npm test
  ```
- **Specific Browser:**
  ```bash
  npm run test:chromium
  npm run test:firefox
  npm run test:webkit
  ```
- **With Allure Reporting:**
  ```bash
  npm run test:allure
  ```

## Viewing Allure Reports

1. Run tests with Allure:
   ```bash
   npm run test:allure
   ```
2. Serve the report:
   ```bash
   npm run allure:serve
   ```

## CI Integration

- Tests run automatically on push and pull request to `main` via GitHub Actions.
- Allure results are uploaded as an artifact.

## Test Scenarios

- **Men:** Add XS Blue Jacket to cart, checkout, apply discount, set shipping to Netherlands.
- **Women:** Add 2x XS Blue Jacket to cart, checkout, apply discount, set shipping to Netherlands.
- **Gear:** Add random Yoga Bag to cart, checkout, apply discount, set shipping to Netherlands.

## Dynamic Data Handling

- If filters return no results (e.g., no jackets in blue/XS), the test is skipped gracefully and logs the reason.

## Tech Stack

- Playwright (TypeScript)
- Allure Reporting
- GitHub Actions (CI)

## Notes

- Tests are designed to work with any valid product details provided as input, ensuring flexibility and coverage for the available catalog.
- See `tests/scenarios/` for example test cases.
- See `pages/` for Page Object Models.
- See `utils/` for helpers and test data. 
