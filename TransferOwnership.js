import { Alert, Box, Button, CircularProgress, Container, TextField, Typography } from 
"@mui/material"; 
import { ethers } from "ethers"; 
import { useEffect, useState } from "react"; 
import Web3Modal from "web3modal"; 
 
// ABI for AssetTracking contract (simplified) 
 
 
const ASSET_ABI = [ 
  "function approve(address to, uint256 tokenId) external", 
  "function getApproved(uint256 tokenId) external view returns (address)", 
  "function ownerOf(uint256 tokenId) external view returns (address)" 
]; 
 
// ABI for OwnershipTransfer contract 
const OWNERSHIP_ABI = [ 
  "function transferOwnership(address to, uint256 assetId) external", 
  "function assetContract() external view returns (address)" 
]; 
const TransferOwnership = () => { 
  const [assetId, setAssetId] = useState(""); 
  const [newOwner, setNewOwner] = useState(""); 
  const [status, setStatus] = useState({ message: "", severity: "info" }); 
  const [isApproved, setIsApproved] = useState(false); 
  const [isOwner, setIsOwner] = useState(false); 
  const [loading, setLoading] = useState(false); 
  // Validate Ethereum address format 
  const isValidAddress = (address) => { 
    return ethers.isAddress(address); 
  }; 
  // Check approval status and ownership 
 
 
  const checkPermissions = async () => { 
    if (!assetId || !newOwner || !isValidAddress(newOwner)) return; 
    try { 
      setLoading(true); 
      const web3Modal = new Web3Modal(); 
      const instance = await web3Modal.connect(); 
      const provider = new ethers.BrowserProvider(instance); 
      const signer = await provider.getSigner(); 
      const userAddress = await signer.getAddress(); 
      // Create contract instances 
      const assetContract = new ethers.Contract( 
        process.env.REACT_APP_ASSET_CONTRACT, 
        ASSET_ABI, 
        signer 
      ); 
      const ownershipContract = new ethers.Contract( 
        process.env.REACT_APP_OWNERSHIP_CONTRACT, 
        OWNERSHIP_ABI, 
        signer 
      ); 
      // Verify contract linkage 
      const linkedAssetContract = await ownershipContract.assetContract(); 
 
 
      if (linkedAssetContract.toLowerCase() !== 
process.env.REACT_APP_ASSET_CONTRACT.toLowerCase()) { 
        throw new Error("Contracts are not properly linked"); 
      } 
      // Check ownership 
      const owner = await assetContract.ownerOf(assetId); 
      setIsOwner(owner.toLowerCase() === userAddress.toLowerCase()); 
      // Check approval 
      const approvedAddress = await assetContract.getApproved(assetId); 
      setIsApproved(approvedAddress.toLowerCase() === 
process.env.REACT_APP_OWNERSHIP_CONTRACT.toLowerCase()); 
 
      setStatus({  
        message: isOwner ? "You own this asset" : "You don't own this asset", 
        severity: isOwner ? "success" : "error" 
      }); 
    } catch (err) { 
      console.error("Permission check error:", err); 
      setStatus({  
        message: `Error: ${err.message}`, 
        severity: "error" 
      }); 
    } finally { 
      setLoading(false); 

 
    } 
  }; 
 
  // Approve the transfer 
  const approveTransfer = async () => { 
    try { 
      setLoading(true); 
      setStatus({ message: "Approving...", severity: "info" }); 
 
      const web3Modal = new Web3Modal(); 
      const instance = await web3Modal.connect(); 
      const provider = new ethers.BrowserProvider(instance); 
      const signer = await provider.getSigner(); 
 
      const assetContract = new ethers.Contract( 
        process.env.REACT_APP_ASSET_CONTRACT, 
        ASSET_ABI, 
        signer 
      ); 
      const tx = await assetContract.approve( 
        process.env.REACT_APP_OWNERSHIP_CONTRACT, 
        assetId 
      ); 

 
      await tx.wait(); 
 
      setIsApproved(true); 
      setStatus({  
        message: `Approved! Tx: ${tx.hash.slice(0, 10)}...`, 
        severity: "success" 
      }); 
    } catch (err) { 
      console.error("Approval error:", err); 
      setStatus({  
        message: `Approval failed: ${err.message}`, 
        severity: "error" 
      }); 
    } finally { 
      setLoading(false); 
    }  }; 
  // Execute transfer 
  const transferOwnership = async () => { 
    try {     setLoading(true); 
      setStatus({ message: "Transferring...", severity: "info" }); 
      const web3Modal = new Web3Modal(); 
      const instance = await web3Modal.connect(); 
      const provider = new ethers.BrowserProvider(instance); 
 
 
      const signer = await provider.getSigner(); 
 
      const ownershipContract = new ethers.Contract( 
        process.env.REACT_APP_OWNERSHIP_CONTRACT, 
        OWNERSHIP_ABI, 
        signer 
      ); 
      const tx = await ownershipContract.transferOwnership(newOwner, assetId); 
      await tx.wait(); 
      setStatus({  
        message: `Transferred! Tx: ${tx.hash.slice(0, 10)}...`, 
        severity: "success" 
      }); 
      setIsApproved(false); // Reset approval status 
    } catch (err) { 
      console.error("Transfer error:", err); 
      setStatus({  
        message: `Transfer failed: ${err.message}`, 
        severity: "error" 
      }); 
    } finally { 
      setLoading(false); 
    } 
 
 
  }; 
  // Check permissions when inputs change 
  useEffect(() => { 
    const timer = setTimeout(() => { 
      if (assetId && newOwner && isValidAddress(newOwner)) { 
        checkPermissions(); 
      } 
    }, 500); 
    return () => clearTimeout(timer); 
  }, [assetId, newOwner]); 
  return ( 
    <Container maxWidth="sm" sx={{ mt: 4 }}> 
      <Typography variant="h5" gutterBottom> 
        Transfer Ownership 
      </Typography> 
 
      <Alert severity={status.severity} sx={{ mb: 2 }}> 
        {status.message} 
        {loading && <CircularProgress size={20} sx={{ ml: 2 }} />} 
      </Alert> 
      <TextField 
        fullWidth 
        label="Asset ID" 

 
        variant="outlined" 
        value={assetId} 
        onChange={(e) => setAssetId(e.target.value.replace(/\D/g, ""))} 
        sx={{ mb: 2 }} 
      /> 
      <TextField 
        fullWidth 
        label="New Owner Address" 
        variant="outlined" 
        value={newOwner} 
        onChange={(e) => setNewOwner(e.target.value.trim())} 
        error={newOwner && !isValidAddress(newOwner)} 
        helperText={newOwner && !isValidAddress(newOwner) ? "Invalid Ethereum address" 
: ""} 
        sx={{ mb: 2 }} 
      /> 
      <Box sx={{ display: "flex", gap: 2 }}> 
        <Button 
          variant="contained" 
          onClick={approveTransfer} 
          disabled={!isOwner || isApproved || loading} 
          sx={{ flex: 1 }} 
        > 
 
 
          {isApproved ? "✓ Approved" : "Approve"} 
        </Button> 
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={transferOwnership} 
          disabled={!isOwner || !isApproved || loading} 
          sx={{ flex: 1 }} 
        > 
          Transfer 
        </Button> 
      </Box> 
    </Container> 
  ); 
}; 
export default TransferOwnership; 
