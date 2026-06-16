// functions/[[path]].js

// 👇 替换成你真实的 Worker 地址
const WORKER_URL = 'https://elec.tgwl.workers.dev'; 

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // 只处理 /api 开头的请求
  if (url.pathname.startsWith('/api')) {
    // 去掉 /api 前缀，拼接 Worker URL
    const targetPath = url.pathname.replace('/api', '') + url.search;
    const targetUrl = `${WORKER_URL}${targetPath}`;

    try {
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body
      });

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

  // 其他请求（如 /, /index.html）交给 Pages 默认处理（即返回 public/index.html）
  return context.next();
}