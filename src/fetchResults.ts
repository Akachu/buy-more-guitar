import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import { Client } from 'discord.js';

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

const fetchResultsForKeyword = async (
    keyword: string,
    results: { [key: string]: Result[] },
    client: Client,
    subscriptions?: { [key: string]: string[] }
) => {
    let currentPage = 1;
    let hasMorePages = true;
    const existingIds = new Set(results[keyword]?.map(result => result.id));

    while (hasMorePages) {
        const url = `https://www.digimart.net/search?keywordAnd=${encodeURIComponent(keyword)}&currentPage=${currentPage}`;
        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
                }
            });
            const $ = cheerio.load(response.data);
            const productItems = $('.itemSearchBlock');

            if (productItems.length === 0) {
                hasMorePages = false;
            } else {
                let newItemsFound = false;

                productItems.each((index, element) => {
                    const id = $(element).find('li').first().text().replace('商品ID：', '').trim();
                    if (existingIds.has(id)) {
                        hasMorePages = false;
                        return false; // break the each loop
                    }

                    const title = $(element).find('.ttl a').text().trim();
                    const link = $(element).find('.ttl a').attr('href');
                    const shopName = $(element).find('.itemShopInfo a').text().trim();
                    const thumbnail = $(element).find('.pic img').attr('src');
                    const price = $(element).find('.price').first().text().trim();

                    const result: Result = {
                        id: id,
                        name: title,
                        dateFound: new Date().toISOString(),
                        datePosted: $(element).find('li').eq(1).text().replace('登録：', '').trim(),
                        link: `https://www.digimart.net${link}`,
                        shopName: shopName,
                        thumbnail: `https:${thumbnail}`,
                        price: price
                    };
                    results[keyword] = results[keyword] || [];
                    results[keyword].push(result);
                    fs.writeFileSync('./results.json', JSON.stringify(results, null, 2));
                    newItemsFound = true;

                    // 구독자에게 알림 보내기
                    if (subscriptions && subscriptions[keyword]) {
                        subscriptions[keyword].forEach(async (userId) => {
                            const user = await client.users.fetch(userId);
                            if (user) {
                                user.send(`새로운 상품이 등록되었습니다: ${title}\n가격: ${price}\n가게: ${shopName}\n링크: https://www.digimart.net${link}`);
                            }
                        });
                    }
                });

                if (!newItemsFound) {
                    hasMorePages = false;
                }
            }
        } catch (error) {
            console.error(`키워드 '${keyword}' 검색 중 오류 발생 (페이지 ${currentPage}):`, error);
            hasMorePages = false;
        }
        currentPage += 1;
    }
};

export default fetchResultsForKeyword;