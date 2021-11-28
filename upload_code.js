require("dotenv").config()
const fs = require("fs-extra")
const w3s = require("web3.storage")
const archiver = require("archiver")
const crypto = require("crypto")

function mkdir (dir) {
	if (!fs.existsSync(dir))
		fs.mkdirSync(dir)
	return dir
}

const w3sClient = new w3s.Web3Storage({ 
	token: process.env.WEB3_STORAGE_API_TOKEN 
})

const zipDir = mkdir("zip")
const ignores = [
	"package-lock.json", 
	"node_modules",
	"images",
	"metadata",
	"zip",
	"code.zip",
	"upload_code.sh"
]

function zipDirectory (source, out) {
	const archive = archiver('zip', { zlib: { level: 9 }})
	const stream = fs.createWriteStream(out)

	return new Promise((resolve, reject) => {
		archive
			.directory(source, false)
			.on('error', err => reject(err))
			.pipe(stream)

		stream.on('close', () => resolve())
		archive.finalize()
	})
}

async function uploadCode () {
	
	const codeZipPath = "code.zip"	
	fs.removeSync(codeZipPath)
	fs.removeSync(zipDir)

	fs.readdirSync(".")
	.filter(p => !/^\./.test(p) && ignores.indexOf(p) < 0)
	.forEach(p => {
		fs.copySync(p, zipDir + "/" + p)
	})

	await zipDirectory("zip", codeZipPath)

	const hashSum = crypto.createHash("sha256")
	const fileBuffer = fs.readFileSync(codeZipPath)
	hashSum.update(fileBuffer)
	const codeHash = hashSum.digest("hex")
	const files = [new w3s.File([fileBuffer], codeZipPath)]
	const codeCID = await w3sClient.put(files)
	const codeURI = ("https://" + codeCID + ".ipfs.dweb.link/" + codeZipPath) 

	console.log("Done: ")
	console.log({ codeURI, codeHash })

	fs.removeSync(zipDir)
	fs.removeSync(codeZipPath)
}
uploadCode()
