import fs from 'fs'
import path from 'path'
import { verifyDKIMSignature } from '@zk-email/helpers/dist/dkim'
import {
	MAX_BODY_PADDED_BYTES,
	MAX_HEADER_PADDED_BYTES,
	generateCircuitInputs
} from '@zk-email/helpers'

const rawEmail = fs.readFileSync(
	path.join(__dirname, './emls/prueba.eml'),
	'utf8'
)

async function main() {
	const dkimResult = await verifyDKIMSignature(Buffer.from(rawEmail))
	console.log('dkimResult 🧡', dkimResult.body.toString())
	const preselector = 'Your age is:'

	const circuitInputs = generateCircuitInputs({
		rsaSignature: dkimResult.signature, // The RSA signature of the email
		rsaPublicKey: dkimResult.publicKey, // The RSA public key used for verification
		body: dkimResult.body, // body of the email
		bodyHash: dkimResult.bodyHash, // hash of the email body
		message: dkimResult.message, // the message that was signed (header + bodyHash)
		//Optional to verify regex in the body of email
		shaPrecomputeSelector: preselector, // String to split the body for SHA pre computation
		maxMessageLength: MAX_HEADER_PADDED_BYTES, // Maximum allowed length of the message in circuit
		maxBodyLength: MAX_BODY_PADDED_BYTES, // Maximum allowed length of the body in circuit
		ignoreBodyHashCheck: false // To be used when ignore_body_hash_check is true in circuit
	})

	fs.writeFileSync('./input.json', JSON.stringify(circuitInputs))
}

main().catch(console.error)
