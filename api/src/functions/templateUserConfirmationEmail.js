require('dotenv').config();

const url = process.env.URL;

const templateUserConfirmationEmail = (rotaUsuario, usuario, token) => {
	const email = `<html lang="pt-br">
	<body
	style="
		font-family: Arial, Helvetica, sans-serif;
		text-align: center;
		margin: 0;
	"
	>
	<h3
		style="
			font-size: 1.8rem;
			background: linear-gradient(230.17deg, #0167FF 13.99%, #287EFF 84.35%);
			color: #FFFFFF;
			border-radius: 16px 16px 0px 0px;
			padding: 32px;
			font-weight: 600;
			margin: 0;
		"
	>
		Seja bem vindo ${usuario}
	</h3>
	<div style="padding: 42px; background: #eff2f5; border-radius: 0px 0px 16px 16px;">
	<p
		style="
			font-size: 1.5rem;
			display: grid;
			align-items: center;
			justify-content: center;
			color: #000000;
			margin: 0;
		"
	>
		Estamos felizes por tê-lo aqui!
	</p>
	<p
		style="
			font-size: 1rem;
			max-width: 580px;
			margin: 42px auto;
			line-height: 1.4;
			color: #000000;
		"
	>
		Você foi cadastrado com sucesso, porém, por motivos de segurança
		precisamos que você confirme seu email para ter acesso a sua conta.
	</p>
	<a
		style="
			display: block;
			padding: 16px 32px;
			background: linear-gradient(230.17deg, #0167FF 13.99%, #287EFF 84.35%);
			text-decoration: none;
			color: #FFFFFF;
			font-size: 1rem;
			font-weight: 600;
			width: max-content;
			border-radius: 6px;
			margin: 0 auto;
		"
		href="${url}/${rotaUsuario}/att/${token}"
		>Confirmar Email</a
	>
	<p style="margin-top: 42px; line-height: 1.4; color: #000;">
		Botão não funcionou?<br />acesse por este link abaixo:
	</p>
	<a href="${url}/${rotaUsuario}/att/${token}">${url}/${rotaUsuario}/att/${token}</a>
	</div>
	</body>
	</html>`;

	return email;
};

module.exports = templateUserConfirmationEmail;
