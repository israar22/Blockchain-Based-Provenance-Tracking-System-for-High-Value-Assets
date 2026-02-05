import { ethers } from "ethers"; 
import React, { useState } from "react"; 
import Web3Modal from "web3modal"; 
 
function WalletConnect() { 
  const [account, setAccount] = useState(""); 

 
  async function connectWallet() { 
    try { 
      const web3Modal = new Web3Modal(); 
      const instance = await web3Modal.connect(); 
      const provider = new ethers.BrowserProvider(instance); 
      const signer = await provider.getSigner(); 
 
      const userAddress = await signer.getAddress(); 
      setAccount(userAddress); 
    } catch (error) { 
      console.error("Wallet connection failed:", error); 
    } 
  } 
  return ( 
    <div style={{ textAlign: "center", marginTop: 20 }}> 
      <h3>Wallet: {account ? account : "Not Connected"}</h3> 
      <button onClick={connectWallet}> 
        {account ? "Connected" : "Connect Wallet"} 
      </button> 
    </div> 
  ); 
} 
export default WalletConnect;
