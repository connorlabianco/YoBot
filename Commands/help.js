module.exports = {
    name: 'help',
    description: 'Sends full list of commands to user',
    execute(message, args) {
        const embed = {
            "title": `Commands | Prefix - "yooo "`,
            "description": "coin - does a coinflip \n join - brings the bot into your voice channel \n leave - makes the bot leave your voice channel \n play - plays requested audio from youtube. Also skips currently playing song. \n EXAMPLE: \"yooo play [search query]\" \n stop - stops current audio playing on bot and makes bot leave call \n",
            "color": 12714239,
            }
        message.author.send({ embed });
    }
}

