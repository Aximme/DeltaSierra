const Discord = require("discord.js")
const ms = require("ms")

module.exports = {

    name: "mute",
    description: "Timeout / Mute un membre du serveur.",
    permission: Discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    options: [
        {
            type:"user",
            name:"membre",
            description:"Personne visée par le mute",
            required:true
        }, {
            type:"string",
            name:"duree",
            description:"Temps du mute",
            required: true
        }, {
            type:"string",
            name:"raison",
            description:"Raison du mute",
            required:false
        }
    ],


    async run(bot, message, args) {

        let user = args.getUser("membre")
        if(!user) return message.reply("Pas de membre a mute.")
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply("Pas de membre a mute.")

        let time = args.getString("duree")
        if(!time) return message.reply("Vous n\'avez pas saisi de temps.")
        if(isNaN(ms(time))) return message.reply("Vous n\'avez pas saisi le bon format de temps.")
        if(ms(time) > 86400000) return message.reply("le mute ne peut pas durer plus de **28 Jours.**")

        let reason = args.getString("raison")
        if(!reason) reason = `Aucune raison fournie. Auteur du mute : ${message.user.tag}`

        if(message.user.id === user.id) return message.reply("Impossible de s'auto mute.")
        if((await message.guild.fetchOwner()).id === user.id) return message.reply("Impossible de mute le propriétaire du serveur.")
        if(!member.kickable) return message.reply("\\:x: Erreur, impossible de mute ce membre.")
        if(message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Impossible de mute une personne avec un rôle supérieur au tient.")
        if(member.isCommunicationDisabled()) return message.reply("Ce membre est déjà mute.")

        //Message envoyé en pm a l'utilisateur mute
        try{await user.send(`Tu as été mute du serveur ${message.guild.name}. Par : ${message.user.tag} \nTemps : \`${time}\` Raison : \`${reason}\``)} catch(err) {}

        //Envoi du mute dans le salon ou a été saisi la commande
        await message.reply(`${message.user} a mute ${user.tag}.\nTemps : \`${time}\` Raison : \`${reason}\``)
        await member.timeout(ms(time), reason)
    }
}
