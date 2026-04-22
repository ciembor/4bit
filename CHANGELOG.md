# Changelog

This changelog summarizes the full project history reconstructed from the repository commits since the project started on August 20, 2012.

Early history is grouped by day to keep the file readable while still covering the full timeline.

## 2026

### 2026-04-22

- Completed the Vue migration of the remaining UI pieces.
- Refactored `Advanced` controls to Vue components while keeping the legacy jQuery color wheel wrapped inside Vue.
- Ported newer legacy `master` changes into the Vue app, including exporter updates and newer defaults.
- Removed leftover legacy entrypoints and duplicated assets that were no longer used by the Vite app.
- Unified slider wrappers and added proper jQuery UI cleanup on unmount.
- Replaced runtime `<style>` injection with CSS variables driven by the calculated scheme store.
- Scoped component layout styles and moved more styling closer to Vue components.
- Added SEO metadata, JSON-LD, `robots.txt`, `sitemap.xml`, and a dedicated social preview image.
- Configured the Vite production base path for GitHub Pages project-site deploys.
- Simplified the XML sitemap, added a text sitemap fallback, and disabled Jekyll processing for GitHub Pages.
- Updated developer setup notes in the README.
- Updated author links in the README and footer.

### 2026-04-21

- Refactored the `Get Scheme` / download dialog from legacy code to a Vue component.

## 2025

### 2025-01-08

- Refactored color and scheme logic by extracting more behavior from stores into services.

### 2025-01-06

- Added chromatic, black, and white lightness sliders.

### 2025-01-04

- Added hue and saturation sliders.

### 2025-01-02

- Added the editable scheme store.
- Connected the terminal preview to live state.
- Added the dynamic style service used at that stage of the migration.

## 2024

### 2024-12-31

- Added the terminal preview component.

### 2024-12-30

- Applied layout corrections.
- Moved images into `public`.
- Added ESLint with Vue support.

### 2024-12-27

- Rewrote the page shell, header, and footer in Vue.

### 2024-12-21

- Started the modern frontend migration.
- Installed Vue and Pinia.
- Added Vite and Less.
- Created `src/` and moved styles there.
- Removed the legacy Google Closure Library dependency.

## 2023

### 2023-04-17

- Made the download dialog scroll when the terminal list gets long.
- Removed Google Plus and Facebook buttons from the page header/footer area.
- Updated links to the proper domain.
- Adjusted the social media wrapper sizing.
- Added a favicon.

### 2023-04-16

- Moved Closure Compiler into the project via npm and updated the build script.
- Performed cleanup and documentation updates.

### 2023-04-15

- Changed exported configuration formats to download as files instead of opening raw text in a new tab.

### 2023-04-14

- Added the deprecated Google Closure Library as a submodule as an intermediate maintenance step.
- Updated the README.

## 2016

### 2016-04-13

- Merged the Terminator homepage URL fix from PR #25.

### 2016-01-06

- Updated the Terminator homepage URL.

## 2014

### 2014-03-03

- Added Google Analytics.
- Updated `lessc` usage for a newer API and full-path execution.

## 2013

### 2013-02-02

- Merged Terminator support.
- Added Terminator documentation to the README.

### 2013-02-01

- Fixed the color order in the Terminator palette export.

### 2013-01-30

- Added Terminator support.

## 2012

### 2012-09-23

- Added Gnome Terminal support.
- Added PuTTY support.
- Updated the README with PuTTY and Gnome Terminal documentation.

### 2012-09-07

- Added mintty support.
- Revised the mintty exporter.
- Darkened the dialog overlay.

### 2012-09-01 to 2012-09-02

- Added Guake support and revised the generated output.
- Added iTerm2 `.itermcolors` export support.
- Corrected iTerm2 output values to use reals from `0` to `1`.
- Added iTerm2 instructions to the README.
- Cleaned trailing whitespace and other small formatting issues.

### 2012-08-30

- Updated the README.

### 2012-08-27

- Added XFCE4 Terminal support.
- Updated generated timestamps.
- Removed Aptana project config from the repository.

### 2012-08-26

- Improved development build speed.
- Expanded usage instructions and documentation.

### 2012-08-25

- Added the `Get Scheme` button with the dialog flow used by the classic app.
- Prepared KDE-related support for production.
- Updated contributor links, README content, `_blank` behavior, and CSS cache handling.

### 2012-08-24

- Added Konsole `.colorscheme` generation support.
- Merged the related contribution from Stefan Wienert.

### 2012-08-22

- Fixed inverted cyan and magenta colors.
- Bundled third-party libraries, fonts, and images into the repository to simplify contributions.
- Expanded information about supported terminals and project usage.

### 2012-08-21

- Cleaned the app directory.
- Applied early visual fixes.

### 2012-08-20

- Initial commit.
- First beta version of the project.
