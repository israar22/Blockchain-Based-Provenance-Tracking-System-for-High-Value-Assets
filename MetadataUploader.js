import { Alert, Box, Button, Container, LinearProgress, Typography } from 
"@mui/material"; 
import axios from "axios"; 
import { useState } from "react"; 
 
function MetadataUploader() { 
 
 
  const [file, setFile] = useState(null); 
  const [ipfsHash, setIpfsHash] = useState(""); 
  const [uploading, setUploading] = useState(false); 
  const [progress, setProgress] = useState(0); 
  const [error, setError] = useState(null); 
 
  const handleFileChange = (e) => { 
    setFile(e.target.files[0]); 
    setIpfsHash(""); 
    setError(null); 
  }; 
  const uploadToIPFS = async () => { 
    if (!file) { 
      setError("Please select a file first"); 
      return; 
    } 
    setUploading(true); 
    setProgress(0); 
    setError(null); 
    const formData = new FormData(); 
    formData.append("file", file); 
    // Add metadata if needed 
    const metadata = JSON.stringify({ 
 
 
      name: file.name, 
    }); 
    formData.append("pinataMetadata", metadata); 
    try { 
      console.log("Starting upload..."); 
      console.log("Using API Key:", process.env.REACT_APP_PINATA_API_KEY); 
      const res = await axios.post( 
        "https://api.pinata.cloud/pinning/pinFileToIPFS", 
        formData, 
        { 
          maxContentLength: Infinity, 
          headers: { 
            "Content-Type": "multipart/form-data", 
            pinata_api_key: process.env.REACT_APP_PINATA_API_KEY, 
            pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY, 
          }, 
          onUploadProgress: (progressEvent) => { 
            const percentCompleted = Math.round( 
              (progressEvent.loaded * 100) / progressEvent.total 
            ); 
            setProgress(percentCompleted); 
          }, 
        } 
 
 
      ); 
 
      console.log("Upload successful:", res.data); 
      setIpfsHash(`ipfs://${res.data.IpfsHash}`); 
    } catch (err) { 
      console.error("Upload failed:", err); 
      setError(`Upload failed: ${err.response?.data?.error || err.message}`); 
    } finally { 
      setUploading(false); 
    } 
  }; 
  return ( 
    <Container maxWidth="sm" sx={{ mt: 4 }}> 
      <Typography variant="h5" gutterBottom > 
        Upload to IPFS 
      </Typography> 
      <input 
        accept="*/*" 
        style={{ display: "none" }} 
        id="ipfs-file-input" 
        type="file" 
        onChange={handleFileChange} 
      /> 

 
      <label htmlFor="ipfs-file-input"> 
        <Button variant="contained" component="span"> 
          Select File 
        </Button> 
      </label> 
      {file && ( 
        <Typography sx={{ mt: 2 }}> 
          Selected: <strong>{file.name}</strong> ({Math.round(file.size / 1024)} KB) 
        </Typography> 
      )} 
      {uploading && ( 
        <Box sx={{ width: "100%", mt: 2 }}> 
          <LinearProgress variant="determinate" value={progress} /> 
          <Typography sx={{ mt: 1 }}>{progress}% uploaded</Typography> 
        </Box> 
      )} 
      {error && ( 
        <Alert severity="error" sx={{ mt: 2 }}> 
          {error} 
        </Alert> 
      )} 
      {ipfsHash && ( 
        <Box sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}> 

 
          <Typography>IPFS Hash:</Typography> 
          <Typography sx={{ wordBreak: "break-all" }}>{ipfsHash}</Typography> 
          <Button 
            sx={{ mt: 1 }} 
            onClick={() => navigator.clipboard.writeText(ipfsHash)} 
          > 
            Copy Link 
          </Button> 
        </Box> 
      )} 
      <Button 
        variant="contained" 
        color="primary" 
        onClick={uploadToIPFS} 
        disabled={!file || uploading} 
        sx={{ mt: 2 }} 
      > 
        {uploading ? "Uploading..." : "Upload to IPFS"} 
      </Button> 
    </Container> 
  ); 
} 
export default MetadataUploader; 
