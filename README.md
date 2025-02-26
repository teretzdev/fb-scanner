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

## Advanced Usage Scenarios

1. **Automated Scanning with Cron Jobs**:
   - Use a task scheduler like `cron` to automate scanning at regular intervals.
   - Example: Schedule a scan every hour for a specific group URL by sending a POST request to the `/api/scan` endpoint using tools like `curl` or `Postman`.

2. **Custom Log Analysis**:
   - Export logs from the application and analyze them using tools like `Excel` or `Python` scripts for deeper insights into group activity.

3. **Integration with External Dashboards**:
   - Use the API to fetch scan results and integrate them into external dashboards like Grafana or Tableau for visualization.

## Common Troubleshooting Steps

1. **Application Fails to Start**:
   - Ensure all dependencies are installed by running `npm install`.
   - Check if the required ports (default: 3000) are available.

2. **Invalid Facebook Credentials**:
   - Double-check the username and password entered in the "Facebook Credentials" section.
   - Ensure the account is not locked or requires additional verification.

3. **Scan Fails for a Group URL**:
   - Verify that the URL is a valid Facebook group URL.
   - Check the application logs for detailed error messages.

4. **Logs Not Displaying**:
   - Ensure the `data/logs.json` file exists and is writable.
   - Check the server logs for any file permission issues.

## Contribution Guidelines

We welcome contributions from the community! To contribute:

1. **Fork the Repository**:
   - Click the "Fork" button on the GitHub repository page to create your own copy.

2. **Clone the Repository**:
   - Clone your forked repository to your local machine:
     ```bash
     git clone https://github.com/your-username/fb-scanner.git
     ```

3. **Create a New Branch**:
   - Create a branch for your feature or bug fix:
     ```bash
     git checkout -b feature-name
     ```

4. **Make Changes**:
   - Implement your changes and ensure they follow the project's coding standards.

5. **Test Your Changes**:
   - Run the application and ensure your changes work as expected.

6. **Submit a Pull Request**:
   - Push your changes to your forked repository:
     ```bash
     git push origin feature-name
     ```
   - Open a pull request on the original repository and provide a detailed description of your changes.

For any questions or issues, feel free to open a GitHub issue or contact the maintainers.

## Future Improvements

- **Encryption for Credentials**: Enhance security by encrypting stored credentials.
- **Improved Error Reporting**: Provide more detailed and user-friendly error messages.
- **External Monitoring Integration**: Integrate with external monitoring services for advanced analytics and reporting.