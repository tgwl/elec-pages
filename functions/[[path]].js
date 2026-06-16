// functions/[[path]].js

// 👇 替换成你真实的 Worker 地址
const WORKER_URL = 'https://elec.tgwl.workers.dev'; 

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // 🌟 严格只代理 /api 开头的请求 (包括 /api 和 /api/xxx)
  if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
    // 去掉 /api 前缀，拼接 Worker URL
    let targetPath = url.pathname.replace('/api', '');
    // 如果去掉后是空字符串（即请求的是 /api），补一个 /
    if (!targetPath) targetPath = '/'; 
    
    const targetUrl = `${WORKER_URL}${targetPath}${url.search}`;

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

  // 🌟 其他所有请求（包括 /, /index.html, /favicon.ico 等）直接返回 Pages 的静态文件
  return context.next();
}