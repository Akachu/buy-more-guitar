import { Client, GatewayIntentBits, Partials, Message } from 'discord.js';
import * as dotenv from 'dotenv';
import addKeyword from './commands/addKeyword';
import deleteKeyword from './commands/deleteKeyword';
import listKeywords from './commands/listKeywords';
import searchKeyword from './commands/searchKeyword';
import setSearchInterval from './commands/setSearchInterval';
import subscribeKeyword from './commands/subscribeKeyword';
import help from './commands/help';
import fetchResultsForKeyword from './fetchResults';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

// Discord 봇 설정
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions // 반응 관련 권한 추가
    ],
    partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});
const token: string = process.env.DISCORD_BOT_TOKEN as string;
const channelId: string = process.env.DISCORD_CHANNEL_ID as string;

// 설정 파일 경로
const settingsPath = path.resolve(__dirname, '../settings.json');
const resultsPath = path.resolve(__dirname, '../results.json');
const subscriptionsPath = path.resolve(__dirname, '../subscriptions.json');

// 설정 로드
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

let settings: Settings = { keywords: [], searchInterval: 60000 };
if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
} else {
    try {
        settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    } catch (err) {
        console.error('설정을 불러오는 중 오류 발생:', err);
    }
}

// 결과 로드
let results: { [key: string]: Result[] } = {};
if (!fs.existsSync(resultsPath)) {
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
} else {
    try {
        results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
    } catch (err) {
        console.error('결과를 불러오는 중 오류 발생:', err);
    }
}

// 구독 정보 로드
let subscriptions: { [key: string]: string[] } = {};
if (!fs.existsSync(subscriptionsPath)) {
    fs.writeFileSync(subscriptionsPath, JSON.stringify(subscriptions, null, 2));
} else {
    try {
        subscriptions = JSON.parse(fs.readFileSync(subscriptionsPath, 'utf-8'));
    } catch (err) {
        console.error('구독 정보를 불러오는 중 오류 발생:', err);
    }
}

// 디스코드 명령어 설정
client.on('messageCreate', async (message: Message) => {
    if (message.content.startsWith('!키워드추가 ')) {
        await addKeyword(message, settings, results, client);
    } else if (message.content.startsWith('!검색주기 ')) {
        await setSearchInterval(message, settings);
    } else if (message.content.startsWith('!키워드삭제 ')) {
        await deleteKeyword(message, settings, results);
    } else if (message.content.startsWith('!키워드검색 ')) {
        await searchKeyword(message, results);
    } else if (message.content.startsWith('!구독 ')) {
        await subscribeKeyword(message, subscriptions);
    } else if (message.content === '!키워드목록') {
        await listKeywords(message, settings);
    } else if (message.content === '!도움말') {
        await help(message);
    }
});

// 주기적으로 digimart.net에서 키워드 검색
const checkKeywords = async () => {
    for (const keyword of settings.keywords) {
        await fetchResultsForKeyword(keyword, results, client, subscriptions);
    }
};

// 주기적으로 키워드 검색 실행
setInterval(checkKeywords, settings.searchInterval);

// 디스코드 봇 로그인
client.login(token);