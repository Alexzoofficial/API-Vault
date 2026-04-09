import express from "express";
import { createServer as createViteServer } from "vite";
import { createProxyMiddleware, responseInterceptor } from "http-proxy-middleware";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Proxy all requests starting with /api to the target API
  // We will strip the /api prefix before sending to the target
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://apis.prexzyvilla.site",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "", // remove /api prefix
      },
      selfHandleResponse: true,
      onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
        // Ensure CORS headers are set
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        // Only intercept JSON responses
        if (proxyRes.headers['content-type'] && proxyRes.headers['content-type'].includes('application/json')) {
          const response = responseBuffer.toString('utf8');
          try {
            const json = JSON.parse(response);
            
            // Recursively remove or replace creator/author fields
            const cleanCreator = (obj: any) => {
              if (typeof obj === 'object' && obj !== null) {
                if ('creator' in obj) {
                  obj.creator = 'Nexus API Hub';
                }
                if ('author' in obj) {
                  obj.author = 'Nexus API Hub';
                }
                for (const key in obj) {
                  cleanCreator(obj[key]);
                }
              }
            };
            
            cleanCreator(json);
            return JSON.stringify(json);
          } catch (e) {
            // If parsing fails, return original buffer
            return responseBuffer;
          }
        }
        
        return responseBuffer;
      })
    })
  );

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

