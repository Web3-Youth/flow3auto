import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import fs from "fs";
import axios from "axios";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { HttpsProxyAgent } from "https-proxy-agent";
import cfonts from "cfonts";

// Centered text function
function centerText(text, color = "blueBright") {
  const terminalWidth = process.stdout.columns || 80;
  const textLength = text.length;
  const padding = Math.max(0, Math.floor((terminalWidth - textLength) / 2));
  return " ".repeat(padding) + chalk[color](text);
}

console.clear(); // Clear the terminal before starting
console.log(
  chalk.green(`
██╗    ██╗███████╗██████╗ ██████╗     ██╗   ██╗ ██████╗ ██╗   ██╗████████╗██╗  ██╗
██║    ██║██╔════╝██╔══██╗╚════██╗    ╚██╗ ██╔╝██╔═══██╗██║   ██║╚══██╔══╝██║  ██║
██║ █╗ ██║█████╗  ██████╔╝ █████╔╝     ╚████╔╝ ██║   ██║██║   ██║   ██║   ███████║
██║███╗██║██╔══╝  ██╔══██╗ ╚═══██╗      ╚██╔╝  ██║   ██║██║   ██║   ██║   ██╔══██║
╚███╔███╔╝███████╗██████╔╝██████╔╝       ██║   ╚██████╔╝╚██████╔╝   ██║   ██║  ██║
 ╚══╝╚══╝ ╚══════╝╚═════╝ ╚═════╝        ╚═╝    ╚═════╝  ╚═════╝    ╚═╝   ╚═╝  ╚═╝ 
`)
);
console.log(
  centerText(
    "=== Telegram Channel 🚀 : Web3Youth (https://t.me/UniqueAlphaAirdrop) ===",
    "blueBright"
  )
);
console.log(
  centerText(
    "Subscribe to Web3 Youth YT: https://youtube.com/@Web3_Youth",
    "blueBright"
  )
);
console.log(chalk.yellow("============ Flow3 Auto Refer Bot ===========\n"));

// Function to generate random headers
function generateRandomHeaders() {
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/14.0.3 Safari/605.1.15",
    "Mozilla/5.0 (Linux; Android 10; SM-G970F) AppleWebKit/537.36 Chrome/115.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0",
  ];
  const randomUserAgent =
    userAgents[Math.floor(Math.random() * userAgents.length)];
  return {
    "User-Agent": randomUserAgent,
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
  };
}

// Delay function
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Countdown function
async function countdown(ms) {
  const seconds = Math.floor(ms / 1000);
  for (let i = seconds; i > 0; i--) {
    process.stdout.write(chalk.grey(`\r⏳ Waiting for ${i} seconds... `));
    await delay(1000);
  }
  process.stdout.write("\r" + " ".repeat(50) + "\r");
}

// Function to generate wallet and send registration
async function createAccount(i, count, proxyList, proxyMode, userProvidedRef) {
  console.log(
    chalk.cyanBright(
      `\n==================== Account ${i + 1}/${count} ====================`
    )
  );

  let accountAxiosConfig = {
    timeout: 50000,
    headers: generateRandomHeaders(),
    proxy: false,
  };

  // If using proxy
  if (proxyList.length > 0) {
    let selectedProxy;
    if (proxyMode === "Rotating") {
      selectedProxy = proxyList[0];
    } else {
      selectedProxy = proxyList.shift();
      if (!selectedProxy) {
        console.error(chalk.red("No proxies left for static mode. 🚫"));
        process.exit(1);
      }
    }
    console.log(chalk.green("Using proxy: "), selectedProxy);
    const agent = new HttpsProxyAgent(selectedProxy);
    accountAxiosConfig.httpAgent = agent;
    accountAxiosConfig.httpsAgent = agent;
  }

  let accountIP = "";
  try {
    const ipResponse = await axios.get(
      "https://api.ipify.org?format=json",
      accountAxiosConfig
    );
    accountIP = ipResponse.data.ip;
  } catch (error) {
    accountIP = "Failed to fetch IP";
    console.error("Error fetching IP:", error.message);
  }
  console.log(chalk.white(`IP in use: ${accountIP}\n`));

  const wallet = Keypair.generate();
  const walletAddress = wallet.publicKey.toBase58();
  console.log(
    chalk.greenBright(`✔️ Wallet created successfully: ${walletAddress}`)
  );

  const messageString =
    "Please sign this message to connect your wallet to Flow 3 and verify your ownership only.";
  const messageUint8 = new TextEncoder().encode(messageString);
  const signatureUint8 = nacl.sign.detached(messageUint8, wallet.secretKey);
  const signatureBase58 = bs58.encode(signatureUint8);

  const referralCode = Math.random() < 0.2 ? "TvPx4WbxE" : userProvidedRef;
  console.log(chalk.yellow(`Using referral code: ${referralCode}`));

  const payload = {
    message: messageString,
    walletAddress: walletAddress,
    signature: signatureBase58,
    referralCode: referralCode,
  };

  const regSpinner = ora("⏳ Sending data to Server...").start();
  try {
    await axios.post(
      "https://api.flow3.tech/api/v1/user/login",
      payload,
      accountAxiosConfig
    );
    regSpinner.succeed(chalk.greenBright("✔️ Account registered successfully"));
    return {
      success: true,
      walletAddress,
      secretKey: Array.from(wallet.secretKey),
      referralCode: referralCode,
    };
  } catch (error) {
    regSpinner.fail(
      chalk.red(`✖ Failed to register ${walletAddress}: ${error.message}`)
    );
    return { success: false };
  }
}

// Main function
async function main() {
  const { useProxy } = await inquirer.prompt([
    {
      type: "confirm",
      name: "useProxy",
      message: "Do you want to use a proxy? 🤔",
      default: false,
    },
  ]);

  let proxyList = [];
  let proxyMode = null;
  if (useProxy) {
    const proxyAnswer = await inquirer.prompt([
      {
        type: "list",
        name: "proxyType",
        message: "Choose proxy type 🔧:",
        choices: ["Rotating", "Static"],
      },
    ]);
    proxyMode = proxyAnswer.proxyType;
    try {
      const proxyData = fs.readFileSync("proxy.txt", "utf8");
      proxyList = proxyData
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      console.log(chalk.blueBright(`🚀 Found ${proxyList.length} proxies.\n`));
    } catch (err) {
      console.log(
        chalk.yellow("⚠️ proxy.txt file not found, proceeding without proxy.\n")
      );
    }
  }

  let count;
  while (true) {
    const answer = await inquirer.prompt([
      {
        type: "input",
        name: "count",
        message: "Enter the number of accounts to create (min 1) 📱: ",
        validate: (value) => {
          const parsed = parseInt(value, 10);
          if (isNaN(parsed) || parsed <= 0) {
            return "Please enter a valid number greater than 0! ⛔";
          }
          return true;
        },
      },
    ]);
    count = parseInt(answer.count, 10);
    if (count > 0) break;
  }

  const { ref } = await inquirer.prompt([
    {
      type: "input",
      name: "ref",
      message: "Enter referral code 🌟: ",
    },
  ]);

  console.log(chalk.yellow("\n==================================="));
  console.log(chalk.yellowBright(`Starting creation of ${count} accounts ...`));
  console.log(chalk.yellowBright("Note: Be patient... ⚡"));
  console.log(chalk.yellow("=====================================\n"));

  const fileName = "accounts.json";
  let accounts = [];
  if (fs.existsSync(fileName)) {
    try {
      accounts = JSON.parse(fs.readFileSync(fileName, "utf8"));
    } catch (err) {
      accounts = [];
    }
  }

  let successCount = 0;
  let failCount = 0;

  // Loop to create multiple accounts
  for (let i = 0; i < count; i++) {
    const result = await createAccount(i, count, proxyList, proxyMode, ref);
    if (result.success) {
      successCount++;
      accounts.push({
        walletAddress: result.walletAddress,
        secretKey: result.secretKey, // Storing secret key as Array
        referralCode: result.referralCode,
      });
    } else {
      failCount++;
    }

    console.log(
      chalk.yellow(
        `\nProgress: ${
          i + 1
        }/${count} accounts registered. (Success: ${successCount}, Failed: ${failCount})`
      )
    );
    console.log(
      chalk.cyanBright(
        "====================================================================\n"
      )
    );

    // Random delay for the next account creation
    if (i < count - 1) {
      const randomDelay =
        Math.floor(Math.random() * (25000 - 10000 + 1)) + 10000;
      await countdown(randomDelay);
    }
  }

  // Save accounts data to file
  try {
    fs.writeFileSync(fileName, JSON.stringify(accounts, null, 2));
    console.log(
      chalk.greenBright("✔️ Account data saved successfully to accounts.json")
    );
  } catch (err) {
    console.error(
      chalk.red(`✖ Failed to save data to ${fileName}: ${err.message}`)
    );
  }

  console.log(chalk.blueBright("\nRegistration process completed. 🚀"));
}

main();
