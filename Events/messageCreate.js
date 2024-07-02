const Discord = require("discord.js")

module.exports = async(bot, message) => {
    let db = bot.db
    if(message.author.bot || message.channel.type === Discord.ChannelType.DM) return;

    db.query(`SELECT * FROM server WHERE guild = '${message.guild.id}'`, async(err, req) => {

        if(req.length <  1) {
            db.query(`INSERT INTO server (guild, antiraid, antispam) VALUES (${message.guild.id}, 'false', 'false')`)
        }
        if(req[0].antispam === "true") await bot.function.searchSpam(message)
    })
}