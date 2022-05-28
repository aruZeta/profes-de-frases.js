const { readdirSync } = require('node:fs');
const { resolve } = require('path');

const filterRequiredFiles = item =>
      (item.isFile && item.name.endsWith('.js')) || item.isDirectory;

module.exports = {
    readCommands(path, func) {
        readdirSync(resolve(path, 'commands'), { withFileTypes: true })
            .filter(item => filterRequiredFiles(item))
            .forEach(item => {
                let command;

                if (item.isDirectory()) {
                    command = require(resolve(path, `commands/${item.name}/index.js`));
                } else {
                    command = require(resolve(path, `commands/${item.name}`));
                }

                func(command);
            });
    },

    readSubcommands(slashCommand, path) {
        const subcommands = {};

        readdirSync(resolve(path, 'subcommands'), { withFileTypes: true })
            .filter(item => filterRequiredFiles(item))
            .forEach(item => {
                const subcommand =
                      require(resolve(path, `subcommands/${item.name}`));

                subcommand.addSubcommand(slashCommand);
                subcommands[subcommand.name] = subcommand.execute;
            });

        return subcommands;
    }
}
