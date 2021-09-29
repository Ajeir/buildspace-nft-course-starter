import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';

/* For section 3 of the course, ensure that you use the line below
to avoid "'useEffect' is not defined."
*/
import React, { useState, useEffect } from "react";

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {
  // Render Methods

    const checkIfWalletIsConnected = () => {
      /*
       First make sure we have access to window.ethereum
    */

    const { ethereum } = window;

    if(!ethereum) {
      console.log("Ensure you have metamask!");
      return;
    } else {
      console.log("Ethereum object is here", ethereum);
    }
  }
  
    /*
    This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );
  
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">NFT Minting Site</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;

