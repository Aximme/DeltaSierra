const Discord = require("discord.js")

module.exports = {
    name: "ban",
    description: "Bannissement d'un membre avec une raison.",
    permission: Discord.PermissionFlagsBits.BanMembers,
    dm: false,
    options: [
        {
            type:"user",
            name:"membre",
            description:"@ de la personne a bannir",
            required: true
    }, {
            type:"string",
            name:"reason",
            description:"la raison du bannissement",
            required:false
        }
        ],

    async run(bot, message, args) {

        try {
            let ban_author = message.user.tag
            let user =  await bot.users.fetch(args._hoistedOptions[0].value)
            if(!user) return message.reply("Pas de membre à bannir")
            let member = message.guild.members.cache.get(user.id)

            let reason = args.get("reason")
            if(!reason) reason = `Aucune raison renseignée. (Ban par : ${ban_author})`

            // Vérifications d'usage :

            if(message.user.id === user.id) return message.reply("Impossible de te ban toi même.")
            if((await message.guild.fetchOwner()).id === user.id) return message.reply("Impossible de bannir le propriétaire du serveur.")
            if(member && !member.bannable) return message.reply(":x: Erreur, impossible de bannir ce membre.")
            if (member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Impossible de bannir une personne avec un rôle supérieur au tient.")
            if((await message.guild.bans.fetch()).get(user.id)) return message.reply("Cet utilisateur est déjà banni.")

            //Message envoyé en pm a l'utilisateur banni
            try{await user.send(`Tu as été banni du serveur ${message.guild.name}. Par : ${ban_author}\n Raison : \`${reason.value}\``)} catch(err) {}

            //Envoi du ban dans le salon ou a été saisi la commande
            await message.reply(`${message.user} a banni ${user.tag}.\nRaison : \`${reason.value}\``)
            await message.guild.bans.create(user.id, {reason: reason.value})

        } catch (err) {
            console.log(err)
            return message.reply("Saisie de l'utilisateur a bannir incorrecte.")
        }
         //TODO : create embed for msg sending.
    }
}