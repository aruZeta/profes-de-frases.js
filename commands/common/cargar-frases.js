module.exports.execute = async (client, config) => {
	const canalFrases = client.channels.cache.get(config.canalFrasesId);
	const frases = {};
	let cantidad = 0;

	const comprobarFrase = (message) => {
		try {
			const [ _, letra, frase ] = message.content.match(/^.*([a-z]):.*> (.*)$/s);
			if (!frases[letra]) {
				frases[letra] = [frase];
			} else {
				frases[letra].push(frase);
			}
		} catch (error) {
			message.reply(`
Frase invalida. Formato:
letra:
> frase
			`);
		}
	}

  // Create message pointer
  let message = await canalFrases.messages
    .fetch({ limit: 1 })
    .then(messages => {
		  comprobarFrase(messages.at(0));
			return messages.size === 1 ? messages.at(0) : null;
		})

  while (message) {
    await canalFrases.messages
      .fetch({ limit: 100, before: message.id })
			.then(messages => {
				cantidad += messages.size;
				messages.forEach(message => comprobarFrase(message));

				// Update our message pointer to be last message in page of messages
				message = 0 < messages.size ? messages.at(messages.size - 1) : null;
      })
	}

	return { frases: frases, cantidad: cantidad };
}
