import { Message } from 'discord.js';

const help = async (message: Message) => {
    const helpMessage = `
사용 가능한 명령어:
1. !키워드추가 [키워드] - 새로운 키워드를 추가합니다.
2. !키워드삭제 [키워드] - 키워드를 삭제합니다.
3. !키워드목록 - 현재 등록된 키워드 목록을 표시합니다.
4. !검색주기 [초] - 검색 주기를 설정합니다.
5. !키워드검색 [키워드] [세부키워드] - 특정 키워드에 대한 세부 키워드를 검색합니다.
6. !도움말 - 명령어 목록과 설명을 표시합니다.
  `;
    message.channel.send(helpMessage);
};

export default help;