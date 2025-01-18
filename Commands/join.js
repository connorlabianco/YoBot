module.exports = {
    name: 'join',
    description: 'Joins the voice channel',
    async execute(message, args) {
        const voiceChannel = message.member.voice.channel;
            voiceChannel.join()
             .then(connection => {

            });
    }
}