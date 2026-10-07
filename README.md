# 도덕 AI 도우미 — Netlify 배포 가이드

Vercel용과 **같은 화면·같은 서버 코드**를 Netlify에서 돌아가게 묶은 것입니다. 챗봇(`/`)과 섬 탐험(`/island.html`) 두 화면이 모두 들어 있습니다.

## 구조
```
/netlify.toml               Netlify 설정(공개 폴더, 서버 함수 폴더)
/public/                    공개되는 파일(이 폴더만 인터넷에 열립니다)
   index.html               챗봇 화면
   island.html              섬 탐험 화면
   prompts.json             AI에게 보내는 지침과 덕목 정보
   assets/island/           섬 탐험 그림
/netlify/functions/         서버 함수 3개 (주소: /api/chat, /api/create-room, /api/config)
/netlify/lib/               서버 함수가 불러 쓰는 코드(공개 주소 없음)
```

- 이 묶음은 `tools/build_netlify.py`가 Vercel용 프로젝트에서 자동으로 만든 것입니다. **직접 고치지 말고**, 원본(`moral-explorer-project`)을 고친 뒤 다시 만들어 올립니다.
- API 키는 서버 함수 안에서만 쓰이고 학생 화면으로 나가지 않습니다(Vercel용과 같음).

## 처음 배포하는 방법

1. **GitHub에 새 저장소**를 만들고, 이 폴더 안의 내용 전체(`netlify.toml`, `package.json`, `public/`, `netlify/`)를 올립니다. Vercel에 연결된 기존 저장소와 섞지 않는 것이 안전합니다.
2. **Netlify**(app.netlify.com)에서 새 프로젝트를 만들 때 "기존 프로젝트 가져오기(Import an existing project)" → GitHub → 방금 만든 저장소를 고릅니다.
   - 빌드 명령(Build command)은 **비워 둡니다**. 공개 폴더(Publish directory)는 `public`, 함수 폴더(Functions directory)는 `netlify/functions`로 자동 인식됩니다(`netlify.toml`에 적혀 있음).
   - 파일을 끌어다 놓는 방식(드래그 앤 드롭 배포)은 서버 함수가 함께 올라가지 않을 수 있으므로, GitHub 연결 방식을 권합니다.
3. **환경변수**를 넣습니다(프로젝트 설정의 Environment variables). 넣은 뒤에는 **다시 배포**해야 적용됩니다(Deploys 화면의 Trigger deploy).

| 이름 | 뜻 | 필요 |
|---|---|---|
| `KV_REST_API_URL` | Upstash Redis 저장소 주소(https://…upstash.io) | 필수 |
| `KV_REST_API_TOKEN` | Upstash Redis 저장소 토큰 | 필수 |
| `ANTHROPIC_API_KEY` | 운영자의 Claude API 키. 넣으면 서버 키 모드(교사가 키를 입력하지 않음) | 선택 |
| `TEACHER_CODE` | 방을 만들 때 입력할 교사 코드 | 서버 키 모드면 권장 |
| `ROOM_CALL_LIMIT` | 방 하나의 AI 호출 한도(기본 6000) | 선택 |

- **저장소 값은 지금 Vercel에 들어 있는 것을 그대로 복사**하면 됩니다(Vercel 프로젝트의 Environment Variables에서 `KV_REST_API_URL`, `KV_REST_API_TOKEN` 값 보기). 이름이 `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`이어도 됩니다.
- 그 저장소는 Vercel을 통해 만든 것이라, Vercel 프로젝트나 연결을 지우면 함께 없어질 수 있습니다. Vercel을 정리할 계획이면 upstash.com에서 Redis 저장소를 직접 새로 만들고 그 주소·토큰을 넣으세요.
- `ANTHROPIC_API_KEY`를 넣지 않으면 교사가 자기 키를 입력하는 방식으로 동작합니다.

4. 배포가 끝나면 `https://(프로젝트이름).netlify.app` 에 접속해 방을 만들어 봅니다. 섬 탐험은 `https://(프로젝트이름).netlify.app/island.html` 입니다.

## 배포 후 확인 순서

1. `https://(주소)/api/config` 를 브라우저로 엽니다. `{"serverKey":true,"needCode":true}` 처럼 짧은 글이 나오면 서버 함수가 살아 있는 것입니다. "Page not found"가 나오면 함수가 올라가지 않은 것입니다(2번 단계의 폴더 구조·배포 방식을 확인).
2. 방을 만듭니다. "서버 저장소 설정이 되어있지 않습니다"가 나오면 저장소 환경변수 이름·값을 확인하고 다시 배포합니다.
3. 학생 링크로 들어가 첫 사례가 나오는지 봅니다.

## Vercel용과 다른 점

- 서버 함수 한 번의 실행 시간 한도는 60초입니다(Netlify 문서 기준, 요금제와 무관). AI 응답은 보통 몇 초 안에 끝나므로 여유가 있습니다.
- 서버 함수가 돌아가는 지역은 기본값이 미국 동부이고, 무료 요금제에서는 바꿀 수 없습니다. 화면 파일은 가까운 곳에서 내려오므로 체감 차이는 AI 응답을 기다릴 때만 조금 있을 수 있습니다.

- 화면과 AI에 보내는 내용, 안전장치는 같습니다. 서버 코드도 같은 파일이며, 관리자 안내 문구의 "Vercel"만 "Netlify"로 바뀌어 있습니다.
- 주소가 달라지므로 학생에게 나눠 줄 링크·QR은 Netlify 주소에서 새로 만들어야 합니다(방 코드는 저장소가 같으면 두 곳에서 모두 통합니다).
- 교사 화면의 "배포별 임시 주소 경고"는 Vercel 주소에서만 뜹니다. Netlify의 미리보기 주소(`deploy-preview-…`)는 기본적으로 로그인 없이 열리지만, 학생에게는 대표 주소 하나만 나눠 주세요.
