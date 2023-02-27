const types = {
	email: {
		regex:
			/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
		message: 'Insira um email válido'
	},
	senha: {
		regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
		message:
			'A senha precisa ter 1 caractere maiúsculo, 1 minúsculo e 1 digito. Com no mínimo 8 caracteres'
	},
	monetario: {
		regex: /^[0-9]\d{0,2}(\.\d{3})*\.\d{2}$/,
		message: 'Utilize apenas numeros que sigam padrão monetario'
	},
	numero: {
		regex: /^[0-9]+$/,
		message: 'Utilize apenas números'
	},
	telefone: {
		regex: /^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/,
		message: 'Insira um número de telefone válido'
	},
	data: {
		regex: /(\d{4})[-.\/](\d{2})[-.\/](\d{2})/,
		message: 'Insira uma data válida'
	},
	boolean: {
		regex: /^true|false$/,
		message: 'Insira um valor correto'
	}
};

function validate(values) {
	const value = Object.values(values)[0];
	const field = Object.keys(values)[0].toLowerCase();

	if (!value && values.isRequired) {
		throw Error(`O campo ${field} é obrigatório.`);
	} else if (
		value &&
		values.type &&
		types[values.type] &&
		!types[values.type].regex.test(value)
	) {
		throw Error(`${types[values.type].message} no campo ${field}`);
	} else {
		return true;
	}
}

module.exports = validate;
