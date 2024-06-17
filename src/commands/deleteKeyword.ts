import * as fs from 'fs';
import { Message } from 'discord.js';

const deleteKeyword = async (message: Message, settings: { keywords: string[]; searchInterval: number }, results: { [key: string]: any[] }) => {
    const keywordToDelete = message.content.replace('!키워드삭제 ', '').replace(/"/g, '');
    const index = settings.keywords.indexOf(keywordToDelete);
    if (index > -1) {
        settings.keywords.splice(index, 1);
        delete results[keywordToDelete]; // 키워드에 대한 결과도 삭제
        fs.writeFileSync('./settings.json', JSON.stringify(settings, null, 2));
        fs.writeFileSync('./results.json', JSON.stringify(results, null, 2));
        message.channel.send(`키워드 '${keywordToDelete}'가 삭제되었습니다.`);
    } else {
        message.channel.send(`키워드 '${keywordToDelete}'를 찾을 수 없습니다.`);
    }
};

export default deleteKeyword;