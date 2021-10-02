import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import cyber from "./images/cyber.png";
import myEpicNft from "./utils/myEpicNft.json";

// Constants

const TWITTER_HANDLE2 = "AjeirC";
const TWITTER_LINK2 = `https://twitter.com/${TWITTER_HANDLE2}`;
const OPENSEA_LINK ="https://testnets.opensea.io/collection/squarenft-lnhdqubh5v";
const TOTAL_MINT_COUNT = 50;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Ensure you have metamask!");
      return;
    } else {
      console.log("Ethereum object is here", ethereum);
    }

    /*
       Check Network type 
      */
    // edit later....console.log(window.ethereum.networkVersion, 'window.ethereum.networkVersion');

    /*
       Check if we're authorized to access the user's wallet
      */
    const accounts = await ethereum.request({ method: "eth_accounts" });

    /*
      User can have multiple authorized accounts, we grab the first one if its there!
      */
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);

      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      setupEventListener();
    } else {
      console.log("No authorized account found");
    }
  };

  /*
     Implement your connectWallet method here
    */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
       Fancy method to request access to account.
      */

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      setupEventListener();
    } catch (error) {
      console.log(error);
    }
  };

  // Setup our listener.
  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          "0xDa755d65EE19f03de7e431A63133B6D9c22040b5",
          myEpicNft.abi,
          signer
        );

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          alert(
            `Waa gwaan?! We've minted your NFT and sent it to your wallet. Suh jus gwaan easy. 
            It can take a max of 10 min to show up on OpenSea. Here's the link: 
            https://testnets.opensea.io/assets/${"0xDa755d65EE19f03de7e431A63133B6D9c22040b5"}/${tokenId.toNumber()}`
          );
        });

        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  

  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = "0xDa755d65EE19f03de7e431A63133B6D9c22040b5";
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log("Mining...please wait.");
        await nftTxn.wait();

        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [minted, setMinted] = useState(0);

  const mintedSoFar = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          "0xDa755d65EE19f03de7e431A63133B6D9c22040b5",
          myEpicNft.abi,
          signer
        );
        const mintedSoFar = await connectedContract.mintedSoFar();
        setMinted(mintedSoFar.toNumber());
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );

  /*
   We want the "Connect to Wallet" button to dissapear if they've already connected their wallet!
   */
  const renderMintUI = () => (
    <button
      onClick={askContractToMintNft}
      className="cta-button connect-wallet-button"
    >
      Mint NFT
    </button>
  );

  /*View NFT collection..... FIX
  const collectionView = () => (
    <button
      onClick={OPENSEA_LINK}
      className="cta-button2 connect-wallet-button2"
    >
      View NFT Collection
    </button>
  ); */

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">NFT Minting Site</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          <p className="sub-text">By Zilla</p>
          {currentAccount === ""
            ? renderNotConnectedContainer()
            : renderMintUI()}
        </div>
        <img className="int" src={cyber} alt="" />
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK2}
            target="_blank"
            rel="noreferrer"
          >{`Built by @${TWITTER_HANDLE2}`}</a>
           <button className="opensea-button"
        onClick={event=> window.location.href=OPENSEA_LINK}> 
        View Collection</button>
        </div>
      </div>
    </div>
  );
};

export default App;
