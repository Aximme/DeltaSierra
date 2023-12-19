const Discord = require("discord.js")

module.exports = {
    name: "kick",
    description: "Expulsion d'un membre",
    permission: Discord.PermissionFlagsBits.KickMembers,
    dm: false,
    options: [
        {
            type:"user",
            name:"membre",
            description:"@ de la personne a expulser",
            required: true
        }, {
            type:"string",
            name:"reason",
            description:"la raison de l'expulsion",
            required:false
        }
    ],

    async run(bot, message, args) {

        let kick_author = message.user.tag
        let user =  await bot.users.fetch(args._hoistedOptions[0].value)
        if(!user) return message.reply("Pas de membre à expulser")
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply("La personne a expulser n'est pas présente sur le serveur.")

        let reason = args.get("reason")
        if(reason === null) reason = `Aucune raison renseignée. (Ban par : ${kick_author})`
        //TODO: fix null reason

        
        // Vérifications d'usage :
        if(message.user.id === user.id) return message.reply("Impossible de te kick toi même.")
        if((await message.guild.fetchOwner()).id === user.id) return message.reply("Impossible de kick le propriétaire du serveur.")
        if(member && !member.kickable) return message.reply("\\:x: Erreur, impossible de kick ce membre.")
        if (member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Impossible de kick une personne avec un rôle supérieur au tient.")

        //Message envoyé en pm a l'utilisateur banni
        try{await user.send(`Tu as été kick du serveur ${message.guild.name}. Par : ${kick_author}\n Raison : \`${reason.value}\``)} catch(err) {}

        //Envoi du ban dans le salon ou a été saisi la commande
        await message.reply(`${message.user} a kick ${user.tag}.\nRaison : \`${reason.value}\``)
        await member.kick(reason)

        }
         //TODO : create embed for msg sending.
}