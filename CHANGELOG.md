# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.2] - 2025-12-15
Improve the awful style of the settings page.

### Changed
- Improve awful settings style (3786859)


## [0.4.1] - 2025-12-15
Fix version number in `manifest.json`.


## [0.4.0] - 2025-12-14
This release introduces a new option to manage which tabs to keep track of. By
default, only mail tabs are managed ; by changing this option, all tabs can be
managed, including `Settings` or `Add-ons` for example. Additionally, the
extension now take into account the current opened tabs when loading or when
settings are updated.

### Added
- Add an option to track all tabs types (b7a200b)
- Add a `justfile` to remember how to build the extension (8314528, 90dafdb)

### Changed
- Load opened tabs when the extension loads or settings are changed (3439eef)


## [0.3.0] - 2021-10-18
Enable compatibility for Thunderbird <=68.0


## [0.2.0] - 2021-10-17
Add setting page for maxOpenTabs.


## [0.1.0] - 2021-10-17
Setup the project.
