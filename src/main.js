const express = require('express')
const app = express()
const Blockchain = require('./blockchain')
const sha256 = require('sha256')

const blockchain = new Blockchain()

function start(port) {
	app.get('/', (req, res) => {
		res.send(`Use \'http://localhost:5000/mine\' to mine a new block\n
			Use \'http://localhost:5000/get_chain\' to get the list of mined blocks\n
			Use \'http://localhost:5000/is_valid\' to check if the last block mined is valid or not`)
	})

	app.get('/mine', function(req, res) {
		const previous_block = blockchain.getPreviousBlock()

		const previous_proof = previous_block['pow']
		const previous_hash = previous_block['hash']
		const proof = blockchain.pow(previous_proof)
		const current_hash = blockchain.hashBlock(previous_proof)
		const block = blockchain.createBlock(proof, previous_hash, current_hash)

		res.json({
			message: 'New block was mined',
			index: block['index'],
			timestamp: block['timestamp'],
			proof: block['pow'],
			hash: block['hash'],
			previous_hash: block['previous_hash']
		})
	})

	app.get('/get_chain', (req, res) => {
		res.send(blockchain)
	})

	app.get('/is_valid', (req, res) => {
		const is_valid = blockchain.isValid(blockchain.chain)
		if (is_valid == true)
			res.send('Blockchain valid')
		else
			res.send('The blockchain is not valid')
	})

	app.listen(port, function() {
		console.log(`http://localhost:${port}`)
	})
}

module.exports = { start }