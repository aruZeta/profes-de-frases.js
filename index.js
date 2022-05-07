const { Client, Collection, Intents } = require('discord.js');
const { config: setupEnvVars } = require('dotenv');

const { inviteLink } = require('./common/invite');
const { readCommands } = require('./common/read');
const { setupDB } = require('./common/mongo');

setupEnvVars();

const discord = new Client({ intents: [Intents.FLAGS.GUILDS] });
const mongoCollections = {};

discord.login(process.env.token);

discord.once('ready', () => {
	console.log(`Logged in as ${discord.user.tag}!`);
	console.log(inviteLink);

	discord.user.setActivity('ping pong');
	discord.user.setUsername('Cristotractor');

	discord.commands = new Collection();
	const addToDiscord = command =>
		discord.commands.set(command.slashCommand.name, command);
	readCommands(__dirname, addToDiscord);

	setupDB(mongoCollections, ['phrases', 'insults']);
});

discord.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = discord.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute({ interaction, discord, mongoCollections });
	} catch (error) {
		// Check errors are not actually errors
		if (error != 'Check failed') {
			console.error(error);
			await interaction.reply({
				content: 'Hubo un error ejecutando el comando.',
				ephemeral: true
			});
		}
	}
});
