# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## [1.1.0] - 2026-01-03

### Changed

- Migration from Javascript to Typescript
- Migration to module export mode
- Typed data, function, etc.
- Improved architecture

### Fixed

- Refresh follows didn't send any media at first
- Refresh specific comic didn't send the details at first
- Getting the chapter images didn't send any data at first

## [1.0.1] - 2026-01-02

### Fixed

- Refresh comic list with status
- Migration from npm to bun
- Improve architecture

## [1.0.0] - 2025-12-28

### Added

- Comick website list of media add into follows
- Comick media details, chapters & image
- Comick media chapter details with images
- Expressjs integration, javascript used
- Use of mongodb to store the generic data
