module.exports = {
    name: 'coin',
    description: 'coinflip',
    execute(message, args) {
            function doRandHT() {
             var rand = ['HEADS!','TAILS!'];
        
              return rand[Math.floor(Math.random()*rand.length)];
            }
            const embed = {
            "title": `The coin landed on....`,
            "description": doRandHT(),
            "color": 12714239,
            }

        message.channel.send({ embed });
    }
}