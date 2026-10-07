// Netlify 함수(Request → Response)와 기존 서버 코드(req, res)를 이어 준다.
// 기존 코드는 Vercel 방식(req.method, req.body, res.status().json())으로 쓰여 있어서,
// 같은 코드를 고치지 않고 Netlify에서도 그대로 쓰기 위한 연결 부분이다.
export function adapt(handler) {
  return async (request) => {
    let body = {};
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      try { body = await request.json(); } catch (e) { body = {}; }
    }
    let status = 200;
    let payload = {};
    const headers = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' };
    const res = {
      status(code) { status = code; return res; },
      json(data) { payload = data; return res; },
      setHeader(key, value) { headers[String(key).toLowerCase()] = String(value); },
    };
    try {
      await handler({ method: request.method, body }, res);
    } catch (e) {
      console.error('서버 함수 오류:', e);
      status = 500; payload = { error: '서버 오류가 발생했어요. 잠시 후 다시 시도해 주세요.' };
    }
    return new Response(JSON.stringify(payload), { status, headers });
  };
}
