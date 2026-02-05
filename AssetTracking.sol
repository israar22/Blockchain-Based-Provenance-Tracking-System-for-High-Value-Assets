pragma solidity ^0.8.19 
import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; 
import "@openzeppelin/contracts/access/Ownable.sol"; 
contract AssetTracking is ERC721, Ownable { 
    uint256 private _nextTokenId; 
 
    mapping(uint256 => string) private _assetMetadata; 
 
    event AssetRegistered(address indexed owner, uint256 assetId, string metadataURI); 
 
    constructor(address initialOwner) ERC721("AssetProvenance", "ASSET") 
Ownable(initialOwner) {} 
 
    function registerAsset(string memory metadataURI) public returns (uint256) { 
        uint256 newAssetId = _nextTokenId; 
        _nextTokenId++; 
 
        _safeMint(msg.sender, newAssetId); 
        _assetMetadata[newAssetId] = metadataURI; 
 
        emit AssetRegistered(msg.sender, newAssetId, metadataURI);  
 
53 
 
        return newAssetId; 
    } 
 
    function getAssetMetadata(uint256 assetId) public view returns (string memory) { 
        return _assetMetadata[assetId]; 
    } 
 
    function getTotalAssets() public view returns (uint256) { 
        return _nextTokenId; 
    } 
}
