require('dotenv').config();
const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "docId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "hash",
				"type": "string"
			}
		],
		"name": "issueCert",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "docId",
				"type": "string"
			}
		],
		"name": "verifyCert",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

async function issueOnChain(docId, hash) {
  const tx = await contract.issueCert(docId, hash);
  await tx.wait();
  return tx.hash;
}

async function getHashFromChain(docId) {
  return await contract.verifyCert(docId) || null;
}

module.exports = { issueOnChain, getHashFromChain };