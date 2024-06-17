import fetchResultsForKeyword from '../fetchResults';
import * as fs from 'fs';
import { Message, Client } from 'discord.js';

interface Settings {
    keywords: string[];
    searchInterval: number;
}

interface Result {
    id: string;
    name: string;
    dateFound: string;
    datePosted: string;
    link: string;
    shopName: string;
    thumbnail: string;
    price: string;
}

const addKeyword = async (
    message: Message,
    settings: Settings,
    results: { [key: string]: Result[] },
    client: Client
) => {
    const newKeyword = message.content.replace('!키워드추가 ', '').replace(/"/g, '').toLowerCase();
    if (!settings.keywords.includes(newKeyword)) {
        settings.keywords.push(newKeyword);
        results[newKeyword] = []; // 새로운 키워드에 대한 결과 초기화
        fs.writeFileSync('./settings.json', JSON.stringify(settings, null, 2));
        message.channel.send(`키워드 '${newKeyword}'가 추가되었습니다.`);
        await fetchResultsForKeyword(newKeyword, results, client);
        message.channel.send(`키워드 '${newKeyword}'에 대한 이전 목록이 저장되었습니다.`);
    } else {
        message.channel.send(`키워드 '${newKeyword}'는 이미 존재합니다.`);
    }
};

export default addKeyword;