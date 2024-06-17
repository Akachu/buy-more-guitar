import { Message, EmbedBuilder, MessageReaction, User, Message as DiscordMessage } from 'discord.js';

const handlePagination = async (message: Message, keyword: string, subKeyword: string, results: any[]) => {
    let page = 0;
    const itemsPerPage = 5;  // 페이지당 항목 수

    const generateEmbeds = (page: number) => {
        const start = page * itemsPerPage;
        const end = start + itemsPerPage;
        const currentResults = results.slice(start, end);

        return currentResults.map(result => {
            const embed = new EmbedBuilder()
                .setTitle(result.name)
                .setURL(result.link)
                .setDescription(`가격: ${result.price}\n가게 이름: ${result.shopName}`)
                .setFooter({ text: `페이지 ${page + 1} / ${Math.ceil(results.length / itemsPerPage)}` });

            if (result.thumbnail) {
                embed.setThumbnail(result.thumbnail);
            }
            return embed;
        });
    };

    const sendEmbeds = async (page: number): Promise<DiscordMessage[]> => {
        const embeds = generateEmbeds(page);
        const messages: DiscordMessage[] = [];
        for (const embed of embeds) {
            const sentMessage = await message.channel.send({ embeds: [embed] });
            messages.push(sentMessage);
        }
        return messages;
    };

    let sentMessages = await sendEmbeds(page);
    const navigationMessage = await message.channel.send('반응을 추가하여 페이지를 넘기세요 ⬅️➡️');

    await navigationMessage.react('⬅️');
    await navigationMessage.react('➡️');

    const filter = (reaction: MessageReaction, user: User) => ['⬅️', '➡️'].includes(reaction.emoji.name ?? '') && !user.bot;
    const collector = navigationMessage.createReactionCollector({ filter, time: 60000 });

    collector.on('collect', async (reaction, user) => {
        reaction.users.remove(user);

        if (reaction.emoji.name === '➡️' && page < Math.ceil(results.length / itemsPerPage) - 1) {
            page++;
        } else if (reaction.emoji.name === '⬅️' && page > 0) {
            page--;
        } else {
            return;
        }

        // 이전 메시지 삭제
        for (const msg of sentMessages) {
            await msg.delete();
        }

        // 새로운 페이지 메시지 전송
        sentMessages = await sendEmbeds(page);
    });

    collector.on('end', () => {
        navigationMessage.reactions.removeAll().catch(console.error);
    });
};

export default handlePagination;