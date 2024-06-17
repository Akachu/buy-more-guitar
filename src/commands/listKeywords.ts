import { Message } from 'discord.js';

const listKeywords = async (message: Message, settings: { keywords: string[] }) => {
    if (settings.keywords.length > 0) {
        const keywordList = settings.keywords.join('\n');
        message.channel.send(`현재 등록된 키워드 목록:\n${keywordList}`);
    } else {
        message.channel.send('현재 등록된 키워드가 없습니다.');
    }
};

export default listKeywords;