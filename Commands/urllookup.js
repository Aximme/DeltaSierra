const Discord = require("discord.js");
const {EmbedBuilder} = require("discord.js");
const axios = require('axios');

module.exports = {
    name: "urllookup",
    description: "Permet de collecter des informations sur une URL.",
    permission: Discord.PermissionFlagsBits.SendMessages,
    dm: true,
    category:"\\🛠️ •  Outils :",
    options: [
        {
            type:"string",
            name:"url",
            description:"L\'Url dont vous souhaitez collecter les informations.",
            required: true,
            autocomplete: false,
        },
    ],

    async run(bot, message, args) {

        const url = args.getString("url")    ;
        const input = {
            method : 'GET',
            url : 'https://url-lookup-by-api-ninjas.p.rapidapi.com/v1/urllookup',
            params: {
                url: url,
            },
            headers: {
                'X-RapidAPI-Key': '57398f327amsh04bb9e68bbb227ep1e2363jsn098794a5a320',
                'X-RapidAPI-Host': 'url-lookup-by-api-ninjas.p.rapidapi.com'
            },
        };

        try {
            const output = await axios.request(input);
            const embed = new EmbedBuilder()
                .setColor(bot.color)
                .setTitle(`\\🔗 Informations a propos de : ${url}`)
                .setDescription(`> Valide : \`${output.data.is_valid}\`\n> Pays : \`${output.data.country} | ${output.data.country_code}\`\n> Region : \`${output.data.region}\`\n> Ville : \`${output.data.city}\`\n> Coords : \`lat: ${output.data.lat} | lon: ${output.data.lon}\`\n> Code Zip : \`${output.data.zip}\`\n> FSI (Fournisseur Service Internet) : \`${output.data.isp}\`\n> Timezone : \`${output.data.timezone}\`\n> URL : \`${output.data.url}\`\n`)
                .setTimestamp()
                .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });
                await message.reply({embeds : [embed]});
        } catch (err) {
            return await message.reply("Une erreur est surenue.")
        }
    }
}