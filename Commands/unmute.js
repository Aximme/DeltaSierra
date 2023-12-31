const Discord = require("discord.js")
const ms = require("ms")

module.exports = {

    name: "unmute",
    description: "Unmute un membre du serveur.",
    permission: Discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    options: [
        {
            type:"user",
            name:"membre",
            description:"Personne visée par le unmute",
            required:true
        }, {
            type:"string",
            name:"raison",
            description:"Raison du unmute",
            required:false
        }
    ],


    async run(bot, message, args) {

        let user = args.getUser("membre");
        if(!user) return message.reply("Pas de membre a Unmute.")
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply("Pas de membre a Unmute.")

        let reason = args.getString("raison")
        if(!reason) reason = `Aucune raison fournie. Auteur de l'Unmute : ${message.user.tag}`;

        if(!member.moderatable) return message.reply("\\:x: Erreur, impossible d\'Unmute ce membre.")
        if(message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Impossible d\'Unmute une personne avec un rôle supérieur au tient.")
        if(!member.isCommunicationDisabled()) return message.reply("Ce membre est déjà Unmute.")

        try{await user.send(`Tu as été Unmute du serveur ${message.guild.name}. Par : ${message.user.tag} \n Raison : \`${reason}\``)} catch(err) {}
        await message.reply(`${message.user} a Unmute ${user.tag}.\nRaison : \`${reason}\``)

        await member.timeout(null)

    }
}
