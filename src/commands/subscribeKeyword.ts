import { Message } from 'discord.js';
import * as fs from 'fs';

const subscribeKeyword = async (message: Message, subscriptions: { [key: string]: string[] }) => {
    const keyword = message.content.replace('!구독 ', '').replace(/"/g, '').toLowerCase();
    const userId = message.author.id;

    if (!subscriptions[keyword]) {
        subscriptions[keyword] = [];
    }

    if (!subscriptions[keyword].includes(userId)) {
        subscriptions[keyword].push(userId);
        fs.writeFileSync('./subscriptions.json', JSON.stringify(subscriptions, null, 2));
        message.channel.send(`키워드 '${keyword}'에 대한 구독이 완료되었습니다.`);
    } else {
        message.channel.send(`키워드 '${keyword}'를 이미 구독 중입니다.`);
    }
};

export default subscribeKeyword;