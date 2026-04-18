// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TrustChain {
    mapping(string => string) private documents;
    
    function issueCert(string memory docId, string memory hash) public {
        documents[docId] = hash;
    }
    
    function verifyCert(string memory docId) public view returns (string memory) {
        return documents[docId];
    }
}
