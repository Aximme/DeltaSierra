const User = new Map()
const Discord = require("discord.js")

module.exports = async message => {

    if(message.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) return;

    if(User.get(message.author.id)) {
        const data = User.get(message.author.id)
        let difference = message.createdTimestamp - data.lastMessage.createdTimestamp;
        let count = data.msgCount;

// Declenché si + de 5 msg en 3 secondes

        if (difference > 3000) {

            clearTimeout(data.timer)
            data.msgCount = 1;
            data.lastMessage = message;

            data.timer = setTimeout(() => {
                User.delete(message.author.id)
            }, 10000) //= Message supprimé au bout de 10 secondes

            User.set(message.author.id, data)

        } else {
            count++;
            if(count > 3) {
                await message.channel.send(`Attention ! ${message.author} est entrain de spam \`[+ de 5 msg en 3 secondes]\``)
                await message.member.timeout(3000000, "Automod: Spam détecté")

                const messages = [...(await message.channel.messages.fetch({before: message.id})).filter(m => m.author.id === message.author.id).values()].slice(0,5)//Suppression des 5 derniers messages
                await message.channel.bulkDelete(messages)
            } else {
                data.msgCount = count;
                User.set(message.author.id, data)
            }
        }
    } else {
        let FN = setTimeout(() => {
            User.delete(message.author.id)
        }, 10000)

        User.set(message.author.id, {
            msgCount:1,
            lastMessage:message,
            timer:FN
        })
    }
}