# Web3Youth - Flow3 Auto Reff

Web3Youth - Flow3 Auto Reff is a Node.js-based script that automates the process of creating accounts using a referral code, with support for proxy usage. The script allows users to generate Solana wallet addresses, sign messages for verification, and register accounts via an API, all while handling proxy configurations for better anonymity and geographic routing.

## Features

- Generate multiple Solana wallet addresses.
- Sign messages with generated wallet keys.
- Register accounts with a referral code using an external API.
- Proxy support for enhanced privacy and geographic routing.
- Display detailed logs and progress updates.
- Store generated account data in a `accounts.json` file.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (version 14.x or higher)
- [npm](https://www.npmjs.com/) (Node Package Manager)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/web3-youth/flow3auto.git
   ```

2. Navigate into the project directory:

   ```bash
   cd flow3auto
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

## Configuration

1. **Proxy Configuration (Optional)**:  
   If you'd like to use proxies, create a `proxy.txt` file in the root directory. Each line should contain a proxy URL in the following format:

   ```
   http://username:password@hostname:port
   ```

   You can choose between **Rotating** or **Static** proxies. Rotating proxies change with each request, while Static proxies will persist throughout the script execution.

2. **Referral Code**:  
   During execution, you'll be prompted to enter a referral code. Ensure you have the necessary code to complete the registration process.

## Running the Script

1. Start the script by running the following command:

   ```bash
   npm start
   ```

2. Follow the on-screen prompts:
   - **Proxy Usage**: Choose whether to use a proxy.
   - **Number of Accounts**: Enter the number of accounts to generate.
   - **Referral Code**: Provide your referral code.

The script will proceed to generate the requested number of accounts and register them, providing real-time progress feedback in the terminal.

## Example Output

Once the script is started, you will see logs with the following format:

```bash
Starting creation of 5 accounts...
Using proxy: http://proxy.example.com:8080
IP in use: 123.45.67.89

✔️ Wallet created successfully: 5d47....xy9
⏳ Sending data to Server...
✔️ Account registered successfully

Progress: 1/5 accounts registered. (Success: 1, Failed: 0)
```

## Troubleshooting

- **Proxy Issues**: If you encounter issues with proxies, ensure that your `proxy.txt` file is correctly formatted and that the proxies are functional.
- **API Errors**: If the registration fails, the script will display error messages indicating the problem. Ensure that the API is accessible and that your referral code is correct.
