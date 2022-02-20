# ExEx
<span><h4>An extestion for managing extensions.</h4></span>
<hr>

Have too many extensions? Want to organise all of them? Some maybe even be confilcting with each other? <span style="font-size: 15pt; font-weight: bold;">ExEx</span> was created exatly to solve these and many more problems. Now with this extestion installed you can separate your extensions into profiles and enable only those you need for a specific workspace.

Table of Contents:
- [ExEx](#exex)
  - [Important Features](#important-features)
  - [All features](#all-features)
  - [Commands](#commands)
  - [Known Issues](#known-issues)
  - [Future features](#future-features)
  - [Release Notes](#release-notes)

## Important Features
- ### Create profiles of extensions that you want enabled and disabled for your current workspace
![create](https://github.com/da-the-dev/ExEx/blob/master/assets/demo/create.gif?raw=true)
- ### Enable many profiles at a time
![enable-many](https://github.com/da-the-dev/ExEx/blob/master/assets/demo/enable%20many.gif?raw=true)
- ### Edit profiles
![edit](https://github.com/da-the-dev/ExEx/blob/master/assets/demo/edit.gif?raw=true)
- ### Delete them
![delete](https://github.com/da-the-dev/ExEx/blob/master/assets/demo/delete.gif?raw=true)
- ### And many more!
  
## All features
- Create a profile.
- Enable many profiles at a time.
- Delete a profile.
- Edit a profile *(change extension list)*.
- Rename a profile.
- Duplicate a profile. Creates a new profile with the same extensions, but a different name. Usefull when a new profile should be created with extra extensions, but the old one must be preserved.
- Merge profiles. Select multiple profiles to merge into one.
- **Changes to profiles are automatically applied if changed profiles are enabled**.

## Commands
- `xx.createProfile` - Create a profile.
- `xx.enableProfile` - Enable profiles *(leave no profiles selected to disable all extensions)*.
- `xx.deleteProfile` - Delete a profile.
- `xx.editProfile` - Edit a profile *(chage what extension to enable/disable)*.
- `xx.renameProfile` - Rename a profile.
- `xx.duplicateProfile` - Duplicate a profile.
- `xx.mergeProfile` - Merge profiles.

## Known Issues
- Some extensions in some very specific cases might require reloading the window after the profiles have been applied to activate (like Pylance for example). If some extensions are shown as enabled, but don't work, try reloading the window. It requires more testing. If you can, I'd appreciate if you'd report more issues.

## Future features
These are some of my ideas for the future:
- Syncing with settings
- Global profile that is always enabled and 'All' profile that contains all extensions
- Import/export a profile to a file
  
If you want, feel free to open a pull request if you want to contribute.

## Release Notes
Check out [CHANGELOG](CHANGELOG.md) for changes in each version.

 
