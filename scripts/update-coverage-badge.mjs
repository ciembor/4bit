import { readFileSync, writeFileSync } from 'node:fs';

const README_PATH = new URL('../README.md', import.meta.url);
const SUMMARY_PATH = new URL('../coverage/coverage-summary.json', import.meta.url);

const BADGE_START = '<!-- coverage-badge:start -->';
const BADGE_END = '<!-- coverage-badge:end -->';

function badgeColor(percentage) {
  if (percentage >= 90) {
    return 'brightgreen';
  }

  if (percentage >= 80) {
    return 'green';
  }

  if (percentage >= 70) {
    return 'yellowgreen';
  }

  if (percentage >= 60) {
    return 'yellow';
  }

  if (percentage >= 50) {
    return 'orange';
  }

  return 'red';
}

function formatPercentage(value) {
  return Number(value.toFixed(2)).toString();
}

const coverageSummary = JSON.parse(readFileSync(SUMMARY_PATH, 'utf8'));
const lineCoverage = Number(coverageSummary.total.lines.pct);
const formattedCoverage = formatPercentage(lineCoverage);
const color = badgeColor(lineCoverage);
const badge = `[![Coverage](https://img.shields.io/badge/coverage-${encodeURIComponent(`${formattedCoverage}%`)}-${color}?style=flat-square)](#coverage)`;

const readme = readFileSync(README_PATH, 'utf8');
const startIndex = readme.indexOf(BADGE_START);
const endIndex = readme.indexOf(BADGE_END);

if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
  throw new Error('Coverage badge markers not found in README.md');
}

const updatedReadme = [
  readme.slice(0, startIndex + BADGE_START.length),
  `\n${badge}\n`,
  readme.slice(endIndex),
].join('');

writeFileSync(README_PATH, updatedReadme);
