const {
	Client,
	Collection
} = require("discord.js");
const BaseCommand = require("./Command");
const config = require("../config");
const {
	join
} = require("path");
const {
	readdirSync
} = require("fs");


class Bot extends Client {
	constructor(...args) {
		super(...args);

		this.prefix = config.prefix;
		this.config = config;

		this.commands = new Collection();
		this.aliases = new Collection();
		this.cooldowns = new Collection();
	}
	async start() {
		const commandFiles = readdirSync(join(__dirname, "../commands"));
		for (const file of commandFiles) {
			const Command = require(join(__dirname, "../commands", file));
			if (Command.prototype instanceof BaseCommand) {
				const command = new Command(this);
				this.commands.set(command.name, command);
				command.aliases.forEach(aliase => this.aliases.set(aliase, command.name));
			}
		}

		this.on("ready", () => {
			console.log(`Connected to Discord API`);
			console.log(this.user.tag);
			console.log("ID: ", this.user.id);

			this.user.setActivity(`Quran | ${config.prefix}help`, {
				type: "LISTENING"
			});
		});

		super.login(config.token);
	}
}

module.exports = Bot;