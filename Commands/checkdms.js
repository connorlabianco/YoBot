const talkedRecently = new Set(); // Cooldown set

module.exports = {
    name: 'checkdms',
    description: 'Sends a check DMs embed',
    execute(message, args) {
        let person = message.author.username;

        // Cooldown check
        if (talkedRecently.has(message.author.username)) {
            message.author.send("**" + message.author.username + "**, there is a 3-second cooldown for all commands.");
        } else {
            const embed = {
                title: `${person}...`,
                description: "Check your messages",
                color: 12714239,
            };

            // Send the embed to the channel
            message.channel.send({ embeds: [embed] });

            // Add user to cooldown set
            talkedRecently.add(message.author.username);
            setTimeout(() => {
                talkedRecently.delete(message.author.username);
            }, 3000);
        }
    }
};
