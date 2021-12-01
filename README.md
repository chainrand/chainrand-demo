# Chainrand NFT demo 

This project demonstrates how to use Chainrand to generate a NFT collection.

A sample basic smart contract is provided.

The files are simplified for ease of reading. 

# Deployment

1. Publish the smart contract onto your preferred blockchain.  

2. Register an account at [https://web3.storage](https://web3.storage) and get an api key. 

3. Create an `.env` file in this directory, and add your web3.storage api key to the file.
   ```
   WEB3_STORAGE_API_TOKEN=...
   ```

4. Install the dependencies for this project.
   ```
   npm install
   ```

5. Zip and upload the code to IPFS. This uses web3 storage.
   ```
   node upload_code.js
   ```
   The script automatically ignores generated content and private files like `.env`.  

   You can also do it manually, but do make sure to remove and private files.

6. Mint a Chainrand NFT at [https://chainrand.io/#/mint](https://chainrand.io/#/mint).

   Use the `codeURI` and `codeHash` values from the previous step.

   Also, decide on a strong `seedKey` and add it to the `.env` file on a new line.
   ```
   SEED_KEY=...
   ```

7. Once the Chainrand NFT is minted, you can visit [https://chainrand.io/#/tokens](https://chainrand.io/#/tokens) to view it.

   Once the `randomness` value is available, copy it to the `.env` file.
   ```
   RANDOMNESS=...
   ```

8. Generate the NFT images and metadata.

   Essentially, the code concatentates the randomness (in base 10) with the seed key, and uses it to initialize Chainrand's deteministic RNG class.
   ```
   node generate.js
   ```

9. Upload the NFT images and metadata to IPFS. This uses web3 storage.
   ```
   node upload.js 
   ```
   
10. Once minting is over, reveal the NFTs. Then, reveal the seed key in Chainrand.

    Update the smart contract with the `metadataDirCID` generated in the previous step,  
    and the `provenance` which is the OpenSea URI of the Chainrand NFT.
	
	Go to [https://chainrand.io/#/tokens](https://chainrand.io/#/tokens) and update the seed key for the project's token.
	
## `.env` file example

These are just sample values.

```
WEB3_STORAGE_API_TOKEN=eyJ72dg98GUCU65diikhv10v29uhliug7w2z.eyJ8yf118gpJKlwLWR081chIf9S121
SEED_KEY=Pl3aseReplaceThisWithY0ur0WnS33DKey
RANDOMNESS=5892501820275885219648139503635653097827932529095672731392738198242665230727
````

# Credits

The traits are provided on courtesy of [https://sorasdreamworld.io](https://sorasdreamworld.io)

Do visit them to check out the full collection.

# License

MIT