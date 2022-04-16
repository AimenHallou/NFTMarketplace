import { useRouter } from 'next/router';
import { useState } from 'react';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import Image from 'next/image';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const collections = () => {
    const [logoUrl, setLogoUrl] = useState(null);
    const [formInput, updateFormInput] = useState({ name: '', earnings: '' });
    const router = useRouter();

    async function onChange(e) {
        const file = e.target.files[0];
        try {
            const added = await client.add(file, {
                progress: (prog) => console.log(`received: ${prog}`),
            });
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            setLogoUrl(url);
        } catch (e) {
            console.log(e);
        }
    }

    async function createCollection() {
        const { name, earnings } = formInput; //get the value from the form input

        //form validation
        if (!name || !earnings || !logoUrl) {
            return;
        }

        const data = JSON.stringify({
            name,
            earnings,
            logo: logoUrl,
        });

        try {
            const added = await client.add({ path: `/collections/${name}.txt`, content: data });
            console.log(added);
            router.push('/');
        } catch (error) {
            console.log(`Error uploading file: `, error);
        }
    }

    return (
        <div className='flex justify-center'>
            <div className='w-1/2 flex flex-col pb-12'>
                <input
                    placeholder='Collection Name'
                    className='mt-8 border rounded p-4'
                    onChange={(e) => updateFormInput({ ...formInput, name: e.target.value })}
                />
                {/* <textarea
                    placeholder='Description'
                    className='mt-2 border rounded p-4'
                    onChange={(e) => updateFormInput({ ...formInput, description: e.target.value })}
                /> */}
                <input
                    placeholder='Earnings'
                    className='mt-8 border rounded p-4'
                    type='number'
                    onChange={(e) => updateFormInput({ ...formInput, earnings: e.target.value })}
                />
                <input type='file' name='Asset' className='my-4' onChange={onChange} />
                {logoUrl && (
                    <Image
                        src={logoUrl}
                        alt='logo'
                        className='rounded mt-4'
                        width={350}
                        height={500}
                        // blurDataURL="data:..." automatically provided
                        // placeholder="blur" // Optional blur-up while loading
                    />
                )}
                <button onClick={createCollection} className='font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg'>
                    Create Collection
                </button>
            </div>
        </div>
    );
};

export default collections;
