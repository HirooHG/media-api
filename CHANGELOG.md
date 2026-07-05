# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.11.0] - 2026-07-05

### Added

- Implemented the CRUD for reading statuses
- Get and modify the media reading status

## [1.10.2] - 2026-06-21

### Changed

- Improved whole folder & file architecture
- Removed public static path

## [1.10.1] - 2026-06-20

### Fixed

- Fix Previous and Next chapters setters
- Fix bookmark status being a 500 on upsert

## [1.10.0] - 2026-06-17

- Implemented Bookmarks on chapters, only one bookmark by media

### Added

- Search dialog endpoint with a limit of 5 media

## [1.9.0] - 2026-06-12

### Added

- Search dialog endpoint with a limit of 5 media

## [1.8.0] - 2026-05-17

### Added

- Group translators by chapter, avoiding too much chapter in the db

## [1.7.1] - 2026-05-16

### Fixed

- Send sorted medias by title alphabetical
- Media description is nullable
- Chapter value can be a string

## [1.7.0] - 2026-05-14

### Added

- Add offline development with docker
- Websockets background service, with its first feature of loading media all chapters images

### Fixed

- On list empty, last page is 1 by default instead of 0 that provoked breaking bug

## [1.6.0] - 2026-04-27

### Changed

- media list return values: added pagination with last page

## [1.5.0] - 2026-04-23

### Added

- Keycloak Authentication
- Added possibility to add by request an app token

### Changed

- Removed api intern Authentication

## [1.4.0] - 2026-04-18

### Added

- Previous and next chapter

### Fixed

- Keep only useful object props

## [1.3.0] - 2026-04-18

### Changed

- Changed image saving system to MinIO S3 object storage

## [1.2.0] - 2026-04-10

### Added

- Implement Authentication with JWT
- Added Zod parsing for safe object parsing

### Changed

- Improve global architecture

## [1.1.1] - 2026-01-03

### Fixed

- Pagination for chapters & medias

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
