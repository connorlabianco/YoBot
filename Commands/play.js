const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, StreamType } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

module.exports = {
    name: 'play',
    description: 'Joins a voice channel and plays a video from YouTube',
    async execute(message, args) {
        // Check if the user is in a voice channel
        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) {
            return message.reply('You need to be in a voice channel to play music!');
        }

        // Check if a YouTube URL was provided
        if (!args.length) {
            return message.reply('Please provide a YouTube URL!');
        }

        const url = args[0];

        // Validate the YouTube URL
        if (!ytdl.validateURL(url)) {
            return message.reply('Please provide a valid YouTube URL!');
        }

        try {
            // Join the voice channel
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });

            // When the bot successfully connects to the voice channel
            connection.on(VoiceConnectionStatus.Ready, () => {
                console.log('The bot has connected to the channel!');
            });

            // Stream the audio from the YouTube video
            const stream = ytdl(url, {
                filter: 'audioonly',      // Only get audio from the video
                quality: 'highestaudio',  // Get the highest audio quality
            });

            // Log the video info (helpful for debugging)
            stream.on('info', (info) => {
                console.log('Video Info:', info);
            });

            // Create an audio resource from the stream
            const resource = createAudioResource(stream, {
                inputType: StreamType.Opus,
            });

            // Create an audio player
            const player = createAudioPlayer();

            // Play the resource
            player.play(resource);
            connection.subscribe(player);

            // Inform the user that the music is playing
            player.on(AudioPlayerStatus.Playing, () => {
                message.reply(`Now playing: ${url}`);
            });

            // Handle errors that may occur during playback
            player.on('error', (error) => {
                console.error('Error:', error);
                message.reply('An error occurred while playing the audio.');
            });

            // Leave the voice channel when playback is finished
            player.on(AudioPlayerStatus.Idle, () => {
                connection.destroy();
                message.reply('Playback finished, leaving the voice channel!');
            });

        } catch (error) {
            console.error('Error during play command:', error);
            if (error.message.includes("Could not extract functions")) {
                message.reply('There was an error extracting the video stream. This might be due to a restriction on the video or a bug with the library.');
            } else {
                message.reply('There was an unexpected error!');
            }
        }
    },
};
