import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';

const client = ipfsHttpClient({ url: 'https://ipfs.infura.io:5001/api/v0', headers: new Headers().set('Access-Control-Allow-Origin', '*') });

import { nftaddress, nftmarketaddress } from '../config';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
import { EtherscanProvider } from '@ethersproject/providers';
import Image from 'next/image';

export default function CreateItem() {
    const [fileUrl, setFileUrl] = useState(null);
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' });
    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState('');
    const [dropHidden, setDropHidden] = useState(true);
    const router = useRouter();

    async function onChange(e) {
        const file = e.target.files[0];
        try {
            const added = await client.add(file, {
                progress: (prog) => console.log(`received: ${prog}`),
            });
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            setFileUrl(url);
        } catch (e) {
            console.log(e);
        }
    }

    //1. create item (image/video) and upload to ipfs
    async function createItem() {
        const { name, description, price } = formInput; //get the value from the form input

        //form validation
        if (!name || !description || !price || !fileUrl) {
            return;
        }

        const data = JSON.stringify({
            name,
            description,
            image: fileUrl,
        });

        try {
            const added = await client.add(data);
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            //pass the url to sav eit on Polygon adter it has been uploaded to IPFS
            createSale(url);
        } catch (error) {
            console.log(`Error uploading file: `, error);
        }
    }

    useEffect(() => {
        getCollection();
    }, []);

    async function getCollection() {
        
    }

    //2. List item for sale
    async function createSale(url) {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);

        //sign the transaction
        const signer = provider.getSigner();
        let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
        let transaction = await contract.createToken(url);
        let tx = await transaction.wait();

        //get the tokenId from the transaction that occured above
        //there events array that is returned, the first item from that event
        //is the event, third item is the token id.
        console.log('Transaction: ', tx);
        console.log('Transaction events: ', tx.events[0]);
        let event = tx.events[0];
        let value = event.args[2];
        let tokenId = value.toNumber(); //we need to convert it a number

        //get a reference to the price entered in the form
        const price = ethers.utils.parseUnits(formInput.price, 'ether');

        contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

        //get the listing price
        let listingPrice = await contract.getListingPrice();
        listingPrice = listingPrice.toString();

        transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice });

        await transaction.wait();

        router.push('/');
    }

    return (
        <div className='flex justify-center'>
            <div className='w-1/2 flex flex-col pb-12'>
                <input placeholder='Asset Name' className='mt-8 border rounded p-4' onChange={(e) => updateFormInput({ ...formInput, name: e.target.value })} />
                <textarea
                    placeholder='Asset description'
                    className='mt-2 border rounded p-4'
                    onChange={(e) => updateFormInput({ ...formInput, description: e.target.value })}
                />

                <div
                    className='inline-block relative mt-5'
                    onClick={() => {
                        setDropHidden((prevState) => !prevState);
                    }}>
                    <button className='bg-gray-200 text-gray-900 font-semibold py-2 px-4 rounded inline-flex items-center'>
                        <span className='mr-1'>{selectedCollection ? selectedCollection : 'Collection'}</span>
                        <svg className='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
                            <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />{' '}
                        </svg>
                    </button>
                    <ul className={'dropdown-menu absolute text-gray-700 pt-1' + (dropHidden ? ' hidden' : ' block')}>
                        {collections.map((collection) => {
                            return (
                                <li
                                    onClick={() => {
                                        setSelectedCollection(collection.name);
                                    }}
                                    className=''>
                                    <a className='rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap' href='#'>
                                        {JSON.stringify(collection)}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <input
                    placeholder='Asset Price in Eth'
                    className='my-5 border rounded p-4'
                    type='number'
                    onChange={(e) => updateFormInput({ ...formInput, price: e.target.value })}
                />
                <input type='file' name='Asset' className='my-5' onChange={onChange} />
                {fileUrl && (
                    <Image
                        src={fileUrl}
                        alt='Picture of the author'
                        className='rounded mt-4'
                        width={350}
                        height={500}
                        objectFit="contain"
                        // blurDataURL="data:..." automatically provided
                        // placeholder="blur" // Optional blur-up while loading
                    />
                )}
                <button onClick={createItem} className='font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg'>
                    Create NFT
                </button>
            </div>
        </div>
    );
}
