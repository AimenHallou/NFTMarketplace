import {ethers} from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from "web3modal"
import { nftaddress, nftmarketaddress } from '../config';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
import Image from 'next/image';
 
export function test(nft) {
  
    console.log(nft);
    async function buyNFT(nft){
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
    
        const signer = provider.getSigner();
        const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
        const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
        const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
          value: price
        });
        await transaction.wait();
      }
      return (
        <div className="flex justify-center">
            <div className="px-4" style={{ maxWidth: '1600px'}}>
                <button onClick={() => buyNFT(nft)}>Buy</button>
            </div>
        </div>
        )
}