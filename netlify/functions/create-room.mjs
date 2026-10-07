// /api/create-room 주소로 들어온 요청을 netlify/lib/create-room.js로 넘긴다. (tools/build_netlify.py가 만든 파일)
import handler from '../lib/create-room.js';
import { adapt } from '../lib/adapter.mjs';

export default adapt(handler);
export const config = { path: '/api/create-room' };
