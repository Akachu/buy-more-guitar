import handlePagination from '../paginate';
import { Message } from 'discord.js';

const searchKeyword = async (message: Message, results: { [key: string]: any[] }) => {
    const args = message.content.split(' ');
    const keywordToSearch = args[1].replace(/"/g, '').toLowerCase();
    const subKeyword = args.slice(2).join(' ').replace(/"/g, '').toLowerCase();

    const lowerCaseResults = Object.keys(results).reduce((acc, key) => {
        acc[key.toLowerCase()] = results[key];
        return acc;
    }, {} as { [key: string]: any[] });

    if (lowerCaseResults[keywordToSearch]) {
        const keywordResults = lowerCaseResults[keywordToSearch];
        const filteredResults = keywordResults.filter(result => result.name.toLowerCase().includes(subKeyword));
        if (filteredResults.length > 0) {
            await handlePagination(message, keywordToSearch, subKeyword, filteredResults);
        } else {
            message.channel.send(`키워드 '${keywordToSearch}'에 대한 '${subKeyword}' 관련 저장된 상품이 없습니다.`);
        }
    } else {
        message.channel.send(`키워드 '${keywordToSearch}'를 찾을 수 없습니다.`);
    }
};

export default searchKeyword;