module.exports.execute = async (client, config) => {
	const canalFrases = client.channels.cache.get(config.canalFrasesId);
	const frases = {};
	let cantidad = 0;

	await canalFrases.messages.fetch().then(messages => {
		cantidad = messages.size;
		messages.forEach(message => {
			const [ _, letra, frase ] = message.content.match(/^.*([a-z]):.*> (.*)$/s);
			if (!frases[letra]) {
				frases[letra] = [frase];
			} else {
				frases[letra].push(frase);
			}
		})
	});

	return { frases: frases, cantidad: cantidad };
}
