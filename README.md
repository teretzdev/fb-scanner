# teretzdev/fb-scanner

## Installation

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/teretzdev/fb-scanner.git
   ```
2. Navigate to the project directory:
   ```bash
   cd fb-scanner
   ```
3. Install the required dependencies:
   ```bash
   npm install
   ```
4. Start the application:
   ```bash
   npm start
   ```
5. Open your browser and navigate to `http://localhost:3000` to access the web interface.

## Usage

1. **Facebook Credentials**:
   - In the "Facebook Credentials" section of the web interface, enter your Facebook username and password.
   - Click "Save Credentials" to securely store them.

2. **Manage Group URLs**:
   - In the "Manage Group URLs" section, enter the URL of a Facebook group you want to monitor.
   - Click "Add URL" to save the group URL.
   - The list of saved group URLs will be displayed below the input field.

3. **Start Scanning**:
   - Click the "Scan" button next to a group URL to start scanning for posts and comments.
   - The extracted data will be displayed in the logs section.

4. **View Logs**:
   - The "Logs" section displays activity logs for the application.
   - Click "Clear Logs" to remove all logs from the display.

5. **Error Handling**:
   - Any errors encountered by the application will be logged in the "Logs" section for review.

For more details, refer to the source code and comments in the respective files.

## Future Improvements

- **Encryption for Credentials**: Enhance security by encrypting stored credentials.
- **Improved Error Reporting**: Provide more detailed and user-friendly error messages.
- **External Monitoring Integration**: Integrate with external monitoring services for advanced analytics and reporting.