pragma solidity >=0.4.22 <0.6.0;

contract FileManager {
    struct FileInfo {
        string fileName;
        bytes32 fielHash;
        uint256 verify;
    }
    mapping(address => bytes32[]) public userFiles;
    mapping(bytes32 => address) public fileOwner;
    mapping(bytes32 => FileInfo) public fileInfo;
    
    function insertFile(bytes32 _hash) public {
        userFiles[msg.sender].push( _hash);
        fileOwner[_hash] = msg.sender;
        
    }
    function getHash(string memory _txt) public pure returns(bytes32){
        return keccak256(abi.encode(_txt));
    }
    function givePoint()
}