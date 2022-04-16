import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { nftaddress, nftmarketaddress } from '../config';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

export const NFTCard = ({ nft, forSale = false, buyCallback }) => {
    const router = useRouter();
    const [isSeller, setIsSeller] = useState(false);

    useEffect(() => {
        getOwned();
    }, [nft]);

    async function getOwned() {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);

        if (nft.seller && connection.selectedAddress) {
            setIsSeller(nft.seller.toUpperCase() === connection.selectedAddress.toUpperCase());
        }
    }

    return (
        <div className='border shadow rounded-xl overflow-hidden flex flex-col'>
            <div className='h-full w-full flex justify-center bg-gray-900'>
                <img src={nft.image} alt='Picture of the author' className='object-cover h-80 max-h-96' />
            </div>
            <div className='p-4'>
                <p style={{ height: 'px' }} className='text-2xl font-semibold'>
                    {nft.name}
                </p>
                <div style={{ height: '30px', overflow: 'hidden' }}>
                    <p className='text-gray-400'>{nft.description}</p>
                </div>
            </div>
            <div className='p-2 bg-gray-900'>
                <p className='text-2xl mb-4 font-bold text-white'>{nft.price} ETH</p>
                <div className='flex justify-center space-x-2'>
                    {forSale && !isSeller && (
                        <button className='w-full bg-pink-500 text-white font-bold py-2 px-12 rounded' onClick={buyCallback}>
                            Buy NFT
                        </button>
                    )}
                    {nft.tokenId && (
                        <button
                            className='w-full bg-blue-400 text-white font-bold py-2 px-12 rounded'
                            onClick={() => {
                                router.push({ pathname: `/nft/${nft.tokenId}` });
                            }}>
                            View
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
