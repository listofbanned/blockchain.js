const sha256 = require('sha256')

function Blockchain() {
	this.chain = []
	this.createBlock(1, '0', '0')
}

Blockchain.prototype.createBlock = function(pow, previous_hash, current_hash) {
	const block = {
		index: this.chain.length + 1,
		timestamp: Date.now(),
		pow: pow,
		hash: current_hash,
		previous_hash: previous_hash
	}

	this.chain.push(block)

	return block
}

Blockchain.prototype.getPreviousBlock = function() {
	return this.chain[this.chain.length - 1]
}

Blockchain.prototype.hashBlock = (previous_proof) => {
	const hash = sha256(previous_proof.toString())
	return hash
}

Blockchain.prototype.pow = (previous_proof) => {
	let new_proof = 1
	let hash_operation = sha256((new_proof ** 2 - previous_proof ** 2).toString())

	while (hash_operation.substring(0, 4) != '0000') {
		new_proof++
		hash_operation = sha256((new_proof ** 2 - previous_proof ** 2).toString())
		//console.log(hash_operation)
	}

	return new_proof
}

Blockchain.prototype.isValid = (chain) => {
	let previous_block = chain[0]
	let index = 1
	let block = 0

	while (index < chain.length) {
		block = chain[index]

		let previous_proof = previous_block['proof']
		let proof = block['proof']
		let hash_operation = sha256((proof ** 2 - previous_proof ** 2).toString())

		if (hash_operation.substring(0, 4) != '0000')
			return false

		previous_block = block
		index++
	}

	return true
}

module.exports = Blockchain