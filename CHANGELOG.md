# CHANGELOG.md

## v0.9.0 - Initial Release

### Features
- **Facebook Group Monitoring**: 
  - Added functionality to monitor Facebook group URLs periodically.
  - Injects content scripts into Facebook pages to extract posts and comments.
  - Logs extracted data and sends it to the background script for processing.

- **Popup Interface**:
  - Allows users to manage Facebook credentials securely.
  - Provides an interface to add, view, and manage Facebook group URLs.
  - Enables toggling monitoring for individual groups.
  - Displays logs of extension activity and errors.

- **Error Handling**:
  - Comprehensive error handling in both background and content scripts.
  - Logs uncaught exceptions and unhandled promise rejections.

- **Logging**:
  - Detailed logging with timestamps for all major actions and events.

### Bug Fixes
- Resolved issues with message passing between content scripts and the background script.
- Fixed errors related to injecting content scripts into Facebook pages.
- Addressed edge cases where monitoring would fail for certain group URLs.

### Notes
- This is the initial release of the FB Scanner Chrome extension.
- Future updates will include enhanced monitoring capabilities and additional features for user convenience.
