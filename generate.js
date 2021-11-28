require("dotenv").config()
const fs = require("fs")
const chainrand = require("chainrand")
const sharp = require("sharp")

function mkdir (dir) {
	if (!fs.existsSync(dir))
		fs.mkdirSync(dir)
	return dir
}

const imageDir = mkdir("images")
const metadataDir = mkdir("metadata")

async function generate () {

	const composeRaw = await fs.promises.readFile("compose.json")
	const compose = JSON.parse(composeRaw)

	const crng = chainrand.CRNG(process.env.RANDOMNESS + process.env.SEED_KEY)

	const results = Array(compose.total).fill(1).map(x => {
		return compose.attributes.map(a => {
			let c = crng.choice(a.choices, a.choices.map(c => c.weight))
			c.trait_type = a.trait_type
			return c
		})
	})	

	console.log("Generating metadata...")
	// Write the jsons
	results.forEach(async (e, i) => {	
		const p = metadataDir + "/" + i + ".json"
		const d = {
			name: "Mini Sora #" + i,
			description: (
				"This is a sample generative NFT to demonstrate Chainrand. " +
				"It is based on the Sora's Dreamworld project.   \n" +
				"[Chainrand](https:\/\/chainrand.io)   \n" +
				"[Sora's Dreamworld](https:\/\/sorasdreamworld.io)"
			),
			external_url: "https:\/\/chainrand.io",
			attributes: e.map(c => {
				return {
					trait_type: c.trait_type, 
					value: c.value
				}
			})
		}
		await fs.promises.writeFile(p, JSON.stringify(d, null, 4))
	})
	
	console.log("Generating images...")
	// Write the images
	results.forEach(async (e, i) => {	
		await sharp(e[0].path)
		.composite(e.slice(1).map(x => { return { input: x.path } }))
		.toFile(imageDir + "/" + i + ".png", (err) => {
			if (err !== null) console.log("Error: ", err)
		})
	})
}
generate()