# Chainrand NFT demo 

This project demonstrates how to use Chainrand to generate a NFT collection off-chain in a verifibly fair manner.

A sample basic smart contract is provided.

The files are simplified for ease of reading. 

# Requirements

- Node v16.9.0 (This is the version used for this project, you may use lower versions if supported)

- An account at [https://web3.storage](https://web3.storage), with an API key. Don't worry, it's free.

# Deployment

1. Publish the smart contract onto your preferred blockchain.  

2. Create an `.env` file in this directory, and add your web3.storage api key to the file.
   ```
   WEB3_STORAGE_API_TOKEN=...
   ```

3. Install the dependencies for this project.
   ```
   npm install
   ```

4. Zip and upload the code to IPFS. This uses web3 storage.
   ```
   node upload_code.js
   ```
   The script automatically ignores generated content and private files like `.env`.  

   You can also do it manually, but do make sure to remove any private files.

5. Mint a Chainrand NFT at [https://chainrand.io/#/mint](https://chainrand.io/#/mint).

   Use the `codeURI` and `codeHash` values from the previous step.

   Also, decide on a strong `seedKey` and add it to the `.env` file on a new line.
   ```
   SEED_KEY=...
   ```

6. Once the Chainrand NFT is minted, you can visit [https://chainrand.io/#/tokens](https://chainrand.io/#/tokens) to view it.

   Once the `randomness` value is available, copy it to the `.env` file.
   ```
   RANDOMNESS=...
   ```

7. Generate the NFT images and metadata.

   Essentially, the code concatentates the randomness (in base 10) with the seed key, and uses it to initialize Chainrand's deteministic RNG class.
   ```
   node generate.js
   ```

8. Upload the NFT images and metadata to IPFS. This uses web3 storage.
   ```
   node upload.js 
   ```
   
9. Once minting is over, reveal the NFTs. 

    Update the smart contract with the `metadataDirCID` generated in the previous step,  
    and the `provenance` which is the OpenSea URI of the Chainrand NFT.
	
10. Finally, reveal the seed key in Chainrand.
	
	Go to [https://chainrand.io/#/tokens](https://chainrand.io/#/tokens) and update the seed key for the project's token.
	
## `.env` file example

These are just sample values.

```
WEB3_STORAGE_API_TOKEN=eyJ72dg98GUCU65diikhv10v29uhliug7w2z.eyJ8yf118gpJKlwLWR081chIf9S121
SEED_KEY=Pl3aseReplaceThisWithY0ur0WnS33DKey
RANDOMNESS=5892501820275885219648139503635653097827932529095672731392738198242665230727
````

# Note

If you prefer to use another language, just take note to follow the general steps.  

You can use one of the Chainrand deterministic cryptographically secure RNG SDKs for your off-chain RNG.

# Credits

The traits are provided on courtesy of [https://sorasdreamworld.io](https://sorasdreamworld.io)

Do visit them to check out the full collection.

# License

MIT