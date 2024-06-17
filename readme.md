
# DigiMart Keyword Tracker

DigiMart Keyword Tracker는 일정 주기별로 DigiMart 사이트를 방문하여 미리 등록한 키워드의 상품이 올라와 있는지 체크하고, 새로운 상품이 발견되면 Discord를 통해 알림을 보내는 Node.js 기반의 TypeScript 프로그램입니다.

## 기능

- **키워드 추가**: 사용자가 추적하고자 하는 키워드를 추가할 수 있습니다.
- **키워드 삭제**: 더 이상 필요하지 않은 키워드를 삭제할 수 있습니다.
- **키워드 목록**: 현재 등록된 키워드 목록을 확인할 수 있습니다.
- **주기 설정**: 상품 검색 주기를 설정할 수 있습니다.
- **키워드 검색**: 등록된 키워드를 검색하여 결과를 확인할 수 있습니다.
- **상품 구독**: 사용자가 특정 키워드를 구독하여 새로운 상품이 등록되면 알림을 받을 수 있습니다.
- **페이지네이션**: 검색 결과를 페이지네이션 방식으로 보여줍니다.

## 설치 및 설정

### 사전 요구 사항

- Node.js
- npm 또는 yarn

### 설치

1. 레포지토리를 클론합니다.

    ```bash
    git clone https://github.com/yourusername/digimart-keyword-tracker.git
    cd digimart-keyword-tracker
    ```

2. 필요한 패키지를 설치합니다.

    ```bash
    npm install
    ```

    또는

    ```bash
    yarn install
    ```

3. `.env` 파일을 생성하고 다음과 같은 환경 변수를 설정합니다.

    ```plaintext
    DISCORD_BOT_TOKEN=your_discord_bot_token
    DISCORD_CHANNEL_ID=your_discord_channel_id
    ```

4. TypeScript를 컴파일합니다.

    ```bash
    npx tsc
    ```

### 실행

프로그램을 실행합니다.

```bash
node dist/bot.js
```

## 사용 방법

### 디스코드 명령어

- `!키워드추가 [키워드]`: 새로운 키워드를 추가합니다.
- `!키워드삭제 [키워드]`: 키워드를 삭제합니다.
- `!키워드목록`: 현재 등록된 키워드 목록을 표시합니다.
- `!검색주기 [초]`: 검색 주기를 설정합니다.
- `!키워드검색 [키워드] [세부키워드]`: 특정 키워드에 대한 세부 키워드를 검색합니다.
- `!구독 [키워드]`: 특정 키워드를 구독하여 새로운 상품이 등록되면 알림을 받습니다.
- `!도움말`: 사용 가능한 명령어 목록과 설명을 표시합니다.

## 기여 방법

1. 이 레포지토리를 포크합니다.
2. 새로운 브랜치를 생성합니다.

    ```bash
    git checkout -b feature/your-feature-name
    ```

3. 기능을 추가하거나 버그를 수정합니다.
4. 변경 사항을 커밋합니다.

    ```bash
    git commit -m 'Add some feature'
    ```

5. 브랜치에 푸시합니다.

    ```bash
    git push origin feature/your-feature-name
    ```

6. Pull Request를 작성합니다.

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 저자

이 프로젝트는 GPT를 사용하여 작성되었습니다.

