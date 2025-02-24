# teretzdev/fb-scanner

## Installation

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/teretzdev/fb-scanner.git
   ```
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" using the toggle in the top-right corner.
4. Click on "Load unpacked" and select the folder where the repository was cloned.
5. The extension will now be installed and visible in the Chrome extensions toolbar.

## Usage

1. **Facebook Credentials**:
   - Open the extension by clicking on its icon in the Chrome toolbar.
   - Enter your Facebook username and password in the "Facebook Credentials" section.
   - Click "Save Credentials" to store them securely.

2. **Manage Group URLs**:
   - In the "Manage Group URLs" section, enter the URL of a Facebook group you want to monitor.
   - Click "Add URL" to save the group URL.
   - The list of saved group URLs will be displayed below the input field.

3. **Monitoring Facebook Groups**:
   - Use the popup interface to enable or disable monitoring for individual Facebook groups.
   - The status of each monitored group will be displayed in the popup interface:
     - **Monitoring**: The group is actively being monitored.
     - **Paused**: Monitoring for the group is temporarily disabled.
     - **Error**: An issue occurred while monitoring the group.

4. **View Logs**:
   - The "Logs" section displays activity logs for the extension.
   - Click "Clear Logs" to remove all logs from the display.

4. **Interacting with Facebook Pages**:
   - Navigate to a Facebook page in your browser.
   - The extension will automatically interact with the page and log relevant information.

5. **Error Handling**:
   - Any errors encountered by the extension will be logged in the "Logs" section for review.

For more details, refer to the source code and comments in the respective files.