module.exports = {
    name: 'leave',
    description: 'bot leaves channel',
    async execute(message, args) {
        voiceChannel = message.member.voice.channel;
        await voiceChannel.leave();
    }
}