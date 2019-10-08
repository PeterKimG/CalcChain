pragma solidity ^0.4.0;

contract Proof
{
    struct FileDetails
    {
        uint timestamp;
        string owner;
    }
    mapping (string => FileDetails) files;
    event logFileAddedStatus(bool status, uint timestamp, string owner, string fileHash);
    
    //this is used to store the owner of file at the block
    function set(string owner, string fileHash) public
    {
        if(files[fileHash].timestamp == 0)
        {
            files[fileHash] = FileDetails(block.timestamp, owner);
            logFileAddedStatus(true, block.timestamp, owner, fileHash);
        }
        else
        {
            logFileAddedStatus(false, block.timestamp, owner, fileHash);
        }
    }
    //this is used to get file information
    function get(string fileHash) public returns (uint timestamp, string owner)
    {
        return (files[fileHash].timestamp, files[fileHash].owner);
    }
}