/*

Developer: Connor La Bianco
Project: YoBot
Description: A Discord bot that plays music from YouTube and has other fun commands.

*/


const { Client, GatewayIntentBits, Collection } = require('discord.js'); // Updated imports for Discord.js v13/v14
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const fs = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ],
});

const talkedRecently = new Set();

const prefix = 'yooo ';
client.commands = new Collection();

// load command files
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (talkedRecently.has(message.author.username)) {
        return message.author.send(`**${message.author.username}**, there is a 3-second cooldown for all commands.`);
    }

    // checks if a command exists in the commands folder
    if (client.commands.has(command)) {
        try {
            await client.commands.get(command).execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('There was an error executing that command.');
        }
    }

    // Add the user to the cooldown set
    talkedRecently.add(message.author.username);
    setTimeout(() => {
        talkedRecently.delete(message.author.username);
    }, 3000);

    // Special case for 'help'
    if (command === 'help') {
        client.commands.get('checkdms').execute(message, args);
    }
});

// Log in to Discord
client.login('BOT_TOKEN_HERE');