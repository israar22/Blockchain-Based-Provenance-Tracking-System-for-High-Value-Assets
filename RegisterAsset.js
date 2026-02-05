import { Web3Provider } from '@ethersproject/providers'; 
import { Button, Container, TextField, Typography } from "@mui/material"; 
import { ethers } from "ethers"; 
import React, { useState } from "react"; 
import Web3Modal from "web3modal"; 
const CONTRACT_ADDRESS = "0x6069bD30F31AB955F8eE5077c7f9eCc6f0285799"; // 
Replace with actual contract address 
const CONTRACT_ABI = [ 
  { 
    "inputs": [{ "internalType": "string", "name": "metadataURI", "type": "string" }], 
    "name": "registerAsset", 
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], 
    "stateMutability": "nonpayable", 
    "type": "function" 
  } 
]; 
 
function RegisterAsset() { 
  const [metadataURI, setMetadataURI] = useState(""); 
  const [message, setMessage] = useState(""); 
  async function registerAsset() { 
    try { 
62 
 
      setMessage("Connecting to wallet..."); 
      const web3Modal = new Web3Modal(); 
      const instance = await web3Modal.connect(); 
      const provider = new Web3Provider(window.ethereum); 
      const signer = await provider.getSigner(); 
 
      setMessage("Sending transaction..."); 
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, 
signer); 
      const tx = await contract.registerAsset(metadataURI); 
      const receipt = await provider.waitForTransaction(tx.hash);  // safer than tx.wait() 
      console.log("Transaction receipt:", receipt); 
 
      setMessage(`   Asset Registered! Transaction: ${tx.hash}`); 
    } catch (error) { 
      console.error("Error registering asset:", error); 
      setMessage("  Failed to register asset."); 
    } 
  } 
  return ( 
    <Container maxWidth="sm" style={{ marginTop: 20, textAlign: "center" }}> 
      <Typography variant="h5">Register Asset</Typography> 
      <TextField 
63 
 
        fullWidth 
        label="Metadata URI" 
        variant="outlined" 
        value={metadataURI} 
        onChange={(e) => setMetadataURI(e.target.value)} 
        style={{ marginTop: 10 }} 
      /> 
      <Button variant="contained" color="primary" onClick={registerAsset} style={{ 
marginTop: 10 }}> 
        Register Asset 
      </Button> 
      <Typography variant="body1" style={{ marginTop: 10 }}>{message}</Typography> 
    </Container> 
  ); 
} 
export default RegisterAsset; 
