# Artist NFT Market 
Rpc host: https://infura.io/

# Local Setup:

Run the following console commands:  
### Create local blockchain network
```shell
npx hardhat node 
```
### Deploy the script to the local blockchain network
```shell
npx hardhat run --network localhost scripts/deploy.js
```
### Run the local react server
```shell
npm run dev
```  
### Make sure Rpc is empty example:  
index.js -> line 18:
```javascript
const provider = new ethers.providers.JsonRpcProvider();
```
Add one of the accounts from the local blockchain to your metamask
Once the project has been deployed, replace the contracts with new ones in the config.js file
</br>
</br>
# Testnet Setup:

### Add the mumbai test-network to your metamask: 
https://docs.polygon.technology/docs/develop/network-details/network

### Make sure you have enough matic to deploy and test: 
https://faucet.polygon.technology/
### Deploy the script to the Mumbai blockchain network
```shell
npx hardhat run --network mumbai scripts/deploy.js
```
### Run the local react server
```shell
npm run dev
```
### Make sure to add a Rpc exit point ex:
index.js -> line 18:  
```javascript
const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.infura.io/v3/8a2b0993791a4a64bf66e0fbce81065d");
```
