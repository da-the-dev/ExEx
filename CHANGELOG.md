# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog],
and this project adheres to [Semantic Versioning].

## [Unreleased]

## [1.3.5] - 06-02-2022

### Fixed
- Fixed a bug where the extension would crash when trying to access `.obsolete` that was not there


## [1.3.4] - 21-01-2022

### Fixed
- Improved extension fetching


## [1.3.3] - 09-01-2022

### Added
- Added missing x64 binaries for sqlite3


## [1.3.2] - 09-01-2022

### Fixed
- Fixed a breaking bug with command loading that broke the extension when downloaded from Marketplace


## [1.3.1] - 09-01-2022

### Fixed
- Fixed README.md dupe command name typo


## [1.3.0] - 09-01-2022

### Added
- Added profile merging

### Changed
- Refactored almost all commands to be more readable
 

## [1.2.0] - 08-01-2022

### Added
- Added an ability to dupicate profiles

### Changed
- Fixed up refreshing after making changes to enabled profiles


## [1.1.4] - 08-01-2022

### Changed
- Made order of elements in menues more convenient

## [1.1.3] - 07-01-2022

### Fixed
- Fixed edit menu reloading after modifying a profile.
- Fixed profile creation. Now users can't create 2 profiles with the same name.
  

## [1.1.2] - 07-01-2022

### Changed
- Edit menu now sorts the extensions comfortably.
- Edit menu automatically re-enables profiles if modified profiles were enabled.

## [1.1.1] - 06-01-2022

### Fixed
- Fixed the icon link

## [1.1.0] - 05-01-2022

### Added
- Added an ability to rename profiles.

### Updated
- Updated README to include the profile renaming feature.
  
### Fixed
- Fixed some variable names.


## [1.0.3] - 05-01-2022

### Fixed
- Fixed package.json (final).


## [1.0.2] - 05-01-2022

### Fixed
- Fixed package.json.


## [1.0.1] - 05-01-2022

### Fixed
- Fixed README.md.
- Fixed icon.


## [1.0.0] - 05-01-2022

### Added
- Added nessesary changes for release on VSCode Marketplace.

### Fixed
- Small bug fixes.


## [0.2.0] - 04-01-2022

### Added
- Added an ability to edit profiles.

## [0.1.3] - 04-01-2022

### Added
- Added enabling many extensions at the same time.
- Added profile deletion.

### Deprecated
- Depricated `ProfileService.enableProfile()` because it is redundant.

### Fixed
- Fixed extension fetching, now it works with all extensions *(hopefully)*.
- Small fixes and optimizations.


## [0.1.2] - 31-12-2021

### Fixed
- Added necessary `await` here and there.
- Updated `README.md` and `CHANGELOG.md`

## [0.1.1] - 31-12-2021

### Fixed
- Fixed how extensions are fetched.
- Small fixes here and there.


## [0.1.0] - 31-12-2021

### Added
- Added an ability to create profiles.
- Added an ablilty to enable 1 profile.
- Added `storageService`, `profileService` and `extensionService`. They take care of their respective components.
- Added all necessary interfaces.
- Added comments,

### Changed
- Updated `.eslintrc.json`.


## [0.0.2] - 27-12-2021

### Added
- Basic functionality.


## [0.0.1] - 27-12-2021
- initial release.

<!-- Links -->
[keep a changelog]: https://keepachangelog.com/en/1.0.0/
[semantic versioning]: https://semver.org/spec/v2.0.0.html

<!-- Versions -->
[unreleased]: https://github.com/da-the-dev/ExEx/compare/v1.3.5...HEAD
[1.3.5]: https://github.com/da-the-dev/ExEx/compare/v1.3.4..v1.3.5
[1.3.4]: https://github.com/da-the-dev/ExEx/compare/v1.3.3..v1.3.4
[1.3.3]: https://github.com/da-the-dev/ExEx/compare/v1.3.2..v1.3.3
[1.3.2]: https://github.com/da-the-dev/ExEx/compare/v1.3.1..v1.3.2
[1.3.1]: https://github.com/da-the-dev/ExEx/compare/v1.3.0..v1.3.1
[1.3.0]: https://github.com/da-the-dev/ExEx/compare/v1.2.0..v1.3.0
[1.2.0]: https://github.com/da-the-dev/ExEx/compare/v1.1.4..v1.2.0
[1.1.4]: https://github.com/da-the-dev/ExEx/compare/v1.1.3..v1.1.4
[1.1.3]: https://github.com/da-the-dev/ExEx/compare/v1.1.2..v1.1.3
[1.1.2]: https://github.com/da-the-dev/ExEx/compare/v1.1.1..v1.1.2
[1.1.1]: https://github.com/da-the-dev/ExEx/compare/v1.1.0..v1.1.1
[1.1.0]: https://github.com/da-the-dev/ExEx/compare/v1.0.3..v1.1.0
[1.0.3]: https://github.com/da-the-dev/ExEx/compare/v1.0.2..v1.0.3
[1.0.2]: https://github.com/da-the-dev/ExEx/compare/v1.0.1..v1.0.2
[1.0.1]: https://github.com/da-the-dev/ExEx/compare/v1.0.0..v1.0.1
[1.0.0]: https://github.com/da-the-dev/ExEx/compare/v0.2.0..v1.0.0
[0.2.0]: https://github.com/da-the-dev/ExEx/compare/v0.1.3..v0.2.0
[0.1.3]: https://github.com/da-the-dev/ExEx/compare/v0.1.2..v0.1.3
[0.1.2]: https://github.com/da-the-dev/ExEx/compare/v0.1.1..v0.1.2
[0.1.1]: https://github.com/da-the-dev/ExEx/compare/v0.1.0..v0.1.1
[0.1.0]: https://github.com/da-the-dev/ExEx/compare/v0.0.2..v0.1.0
[0.0.2]: https://github.com/da-the-dev/ExEx/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/da-the-dev/ExEx/releases/tag/v0.0.1