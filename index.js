require('dotenv').config();

const fs = require('node:fs');
const config = require('./config.json');
const { Client, Collection, Intents } = require('discord.js');
const { MongoClient, ServerApiVersion } = require('mongodb');

const mongoUri = `mongodb+srv://${process.env.mongoUser}:${process.env.mongoPswd}@data.0t392.mongodb.net/data?retryWrites=true&w=majority`;
const mongo = new MongoClient(mongoUri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1
});

const data = {};

const setupDB = async () => {
	await mongo.connect();

	const db = mongo.db("data");
	data['frases'] = db.collection("frases");
	data['insultos'] = db.collection("insultos");

	console.log('DB connected');
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();

const commandFiles =
	fs.readdirSync('./commands')
		.filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	client.user.setActivity('con tu madre');
	client.user.setUsername('Cristotractor');

	console.log(`Logged in as ${client.user.tag}!`);
	const scope = "bot%20applications.commands";
	const link = "https://discord.com/api/oauth2/authorize";
	console.log(`${link}?client_id=${config.clientId}&permissions=${config.permissions}&scope=${scope}`);

	setupDB();
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, client, config, data);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: 'There was an error while executing this command!',
			ephemeral: true
		});
	}
});

client.login(process.env.token);
