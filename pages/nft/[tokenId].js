import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import Web3Modal from 'web3modal';
import { nftmarketaddress, nftaddress } from '../../config';
import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json';

export default function nft() {
    const router = useRouter();
    const { tokenId } = router.query;

    const [nft, setNft] = useState();
    const [loadingState, setLoadingState] = useState('not-loaded');

    useEffect(() => {
        if (tokenId) {
            loadNFT();
        }
    }, [router]);

    async function loadNFT() {
        const web3Modal = new Web3Modal();
        //     {
        //   network: "mainnet",
        //   cacheProvider: true,
        // }
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
        console.log(marketContract);
        const data = await marketContract.fetchNFTbyTokenId(tokenId);

        const tokenUri = await tokenContract.tokenURI(data.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(data.price.toString(), 'ether');
        let item = {
            price,
            tokenId: data.tokenId.toNumber(),
            seller: data.seller,
            owner: data.owner,
            sold: data.sold,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
        };

        setNft(item);
        setLoadingState('loaded');
    }

    return <div>{JSON.stringify(nft)}</div>;
}
