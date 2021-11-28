require("dotenv").config()
const fs = require("fs")
const w3s = require("web3.storage")

function mkdir (dir) {
	if (!fs.existsSync(dir))
		fs.mkdirSync(dir)
	return dir
}

const imageDir = mkdir("images")
const metadataDir = mkdir("metadata")

const w3sClient = new w3s.Web3Storage({ 
	token: process.env.WEB3_STORAGE_API_TOKEN 
})

async function dirCID (path) {
	const files = await w3s.getFilesFromPath(path)
	const cid = await w3sClient.put(files)
	return cid
}

async function storeFiles () {
	console.log("Uploading images...")
	const imagesDirCID = await dirCID(imageDir)
	const metadataFiles = await fs.promises.readdir(metadataDir)

	metadataFiles.filter(filename => (/\.json$/i).test(filename))
	.map(async (filename) => {
		const p = metadataDir + '/' + filename
		const r = await fs.promises.readFile(p)
		let m = JSON.parse(r);
		m.image = ("https://" + imagesDirCID + ".ipfs.dweb.link/" + 
			imageDir + "/" + filename.replace(/\.json$/i, "") + ".png") 
		await fs.promises.writeFile(p, JSON.stringify(m, null, 4))
	})
	console.log("Uploading metadata...")
	const metadataDirCID = await dirCID(metadataDir)
	console.log("Done: ")
	console.log({ metadataDirCID })
}
storeFiles()