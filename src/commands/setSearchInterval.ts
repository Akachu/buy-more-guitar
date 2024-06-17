import * as fs from 'fs';
import { Message } from 'discord.js';

const setSearchInterval = async (message: Message, settings: { searchInterval: number }) => {
    const interval = parseInt(message.content.replace('!검색주기 ', ''), 10);
    if (!isNaN(interval)) {
        settings.searchInterval = interval * 1000;
        fs.writeFileSync('./settings.json', JSON.stringify(settings, null, 2));
        message.channel.send(`검색 주기가 ${interval}초로 설정되었습니다.`);
    } else {
        message.channel.send('올바른 숫자를 입력해주세요.');
    }
};

export default setSearchInterval;