const { config: setupEnvVars } = require('dotenv');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const { clientId, guildId } = require('./config.json');
const { readCommands } = require('./common/read');

setupEnvVars();

const commands = [];
const addToCommands = command =>
      commands.push(command.slashCommand.toJSON());
readCommands(__dirname, addToCommands);

const rest = new REST({ version: '9' }).setToken(process.env.token);

rest.put(
    Routes.applicationGuildCommands(clientId, guildId),
    { body: commands }
).then(() =>
    console.log('Successfully registered application commands.')
).catch(console.error);
