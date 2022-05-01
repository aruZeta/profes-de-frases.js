const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const config = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();

const commandFiles =
	fs.readdirSync('./commands')
		.filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

const scope = "bot%20applications.commands";
const link = "https://discord.com/api/oauth2/authorize";

client.once('ready', () => {
	client.user.setActivity('con tu madre');
	client.user.setUsername('Cristotractor');
	console.log(`Logged in as ${client.user.tag}!`);
	console.log(`Invite link: ${link}?client_id=${config.clientId}&permissions=${config.permissions}&scope=${scope}`);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, client, config);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: 'There was an error while executing this command!',
			ephemeral: true
		});
	}
});

client.login(config.token);
