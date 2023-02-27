const randomPassword = () => {
  const letraMaiuscula = String.fromCharCode((Math.ceil(Math.random() * 26) + 64))
  const letraMinuscula = String.fromCharCode((Math.ceil(Math.random() * 26) + 96))
	const senhaAleatoria = `${letraMaiuscula}${letraMinuscula}${Date.now()}`

	return senhaAleatoria
};

module.exports = randomPassword