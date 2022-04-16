import '../styles/globals.css';
import Link from 'next/link';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }) {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        connect();
    }, []);

    async function connect() {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);

        if (connection.isConnected()) {
            setIsConnected(true);
        } else {
            setIsConnected(false);
        }
    }

    return (
        <div>
            <div>
                <nav className='border-b p-6 flex w-full justify-between'>
                    <div>
                        <p className='text-4xl font-bold'>Artist NFT Market</p>
                        <div className='flex mt-4'></div>
                        <Link href='/'>
                            <a className='mr-4 text-pink-500'>Home</a>
                        </Link>
                        <Link href='/create-item'>
                            <a className='mr-6 text-pink-500'>Sell NFT</a>
                        </Link>
                        <Link href='/my-assets'>
                            <a className='mr-6 text-pink-500'>My NFT</a>
                        </Link>
                        <Link href='/creator-dashboard'>
                            <a className='mr-6 text-pink-500'>Dashboard</a>
                        </Link>
                        <Link href='/collections'>
                            <a className='mr-6 text-pink-500'>Collections</a>
                        </Link>
                    </div>
                    <div className='flex items-center mr-10'>
                        {isConnected ? (
                            <p className='bg-green-300 rounded p-2 px-3'>Connected</p>
                        ) : (
                            <button className='bg-gray-200 rounded p-2 px-3' onClick={connect}>
                                Connect
                            </button>
                        )}
                    </div>
                </nav>
            </div>
            <Component {...pageProps} />
        </div>
    );
}

export default MyApp;
