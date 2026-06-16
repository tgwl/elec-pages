// functions/[[path]].js

// 👇 替换成你真实的 Worker 地址
const WORKER_URL = 'https://elec.tgwl.workers.dev'; 

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // 拼接目标 Worker 的完整 URL
  const targetUrl = `${WORKER_URL}${url.pathname}${url.search}`;

  try {
    // 在服务器端转发请求给 Worker
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body // 自动处理 POST 请求的 body
    });

    // 克隆响应头，确保 CORS 和 Content-Type 正确传递
    const newHeaders = new Headers(response.headers);
    newHeaders.set('Access-Control-Allow-Origin', '*');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  } catch (error) {
    console.error('代理请求失败:', error);
    return new Response(JSON.stringify({ success: false, error: 'Backend proxy failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}