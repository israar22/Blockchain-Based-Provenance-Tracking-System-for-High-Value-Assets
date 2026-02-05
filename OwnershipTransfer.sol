pragma solidity ^0.8.19; 
 
import "@openzeppelin/contracts/token/ERC721/IERC721.sol"; 
import "@openzeppelin/contracts/access/Ownable.sol"; 
 
contract OwnershipTransfer is Ownable { 
    IERC721 public assetContract; 
 
    struct TransferRecord { 
        address from; 
 
 
        address to; 
        uint256 assetId; 
        uint256 timestamp; 
    } 
 
    mapping(uint256 => TransferRecord[]) public assetTransferHistory; 
 
    event OwnershipTransferred( 
        address indexed from, 
        address indexed to, 
        uint256 assetId, 
        uint256 timestamp 
    ); 
 
    constructor(address assetContractAddress, address initialOwner) Ownable(initialOwner) { 
        assetContract = IERC721(assetContractAddress); 
    } 
 
    function transferOwnership(address to, uint256 assetId) public { 
        require(assetContract.ownerOf(assetId) == msg.sender, "Not the asset owner"); 
        require(to != address(0), "Invalid new owner address"); 
 
        // Check approval status 
 
 
        require( 
            assetContract.getApproved(assetId) == address(this) || 
            assetContract.isApprovedForAll(msg.sender, address(this)), 
            "OwnershipTransfer contract not approved" 
        ); 
 
        assetContract.transferFrom(msg.sender, to, assetId); 
        assetTransferHistory[assetId].push(TransferRecord(msg.sender, to, assetId, 
block.timestamp)); 
        emit OwnershipTransferred(msg.sender, to, assetId, block.timestamp); 
    } 
 
    function getTransferHistory(uint256 assetId) public view returns (TransferRecord[] 
memory) { 
        return assetTransferHistory[assetId]; 
    } 
}
