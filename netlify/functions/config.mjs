// /api/config 주소로 들어온 요청을 netlify/lib/config.js로 넘긴다. (tools/build_netlify.py가 만든 파일)
import handler from '../lib/config.js';
import { adapt } from '../lib/adapter.mjs';

export default adapt(handler);
export const config = { path: '/api/config' };
