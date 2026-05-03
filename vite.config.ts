import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

const publicTotalDir = path.resolve(__dirname, "public/total");
const externalTotalDir = path.resolve(__dirname, "../total");

function createDeepseekProxyMiddleware(deepseekApiUrl: string, deepseekApiKey?: string) {
  return async (req: any, res: any, next: any) => {
    if (!req.url?.startsWith("/api/deepseek")) {
      return next();
    }

    if (req.method?.toUpperCase() !== "POST") {
      res.statusCode = 405;
      res.setHeader("Allow", "POST");
      return res.end("Method Not Allowed");
    }

    if (!deepseekApiKey) {
      console.error("[deepseek-proxy] Missing VITE_DEEPSEEK_API_KEY");
      res.statusCode = 500;
      return res.end("Missing VITE_DEEPSEEK_API_KEY");
    }

    let body = "";
    req.on("data", (chunk: Buffer) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const response = await fetch(deepseekApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${deepseekApiKey}`,
          },
          body,
        });

        res.statusCode = response.status;
        response.headers.forEach((value, key) => {
          if (key.toLowerCase() === "transfer-encoding") return;
          res.setHeader(key, value);
        });

        const text = await response.text();
        res.end(text);
      } catch (error) {
        console.error("[deepseek-proxy] Request failed:", error);
        res.statusCode = 502;
        res.end("DeepSeek proxy request failed");
      }
    });

    req.on("error", (err: Error) => {
      console.error("[deepseek-proxy] Request parsing error:", err);
      res.statusCode = 400;
      res.end("Bad Request");
    });
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const deepseekApiUrl = env.VITE_DEEPSEEK_API_URL || "https://api.deepseek.com/v1/chat/completions";
  const deepseekApiKey = env.VITE_DEEPSEEK_API_KEY;

  return {
    base: '/moment/',
    server: {
      host: "0.0.0.0",
      port: 8080,
      hmr: {
        overlay: false,
      },
      fs: {
        allow: [path.resolve(__dirname), path.resolve(__dirname, "../total")],
      },
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      {
        name: "deepseek-api-proxy",
        configureServer(server) {
          server.middlewares.use(createDeepseekProxyMiddleware(deepseekApiUrl, deepseekApiKey));
        },
        configurePreviewServer(server) {
          server.middlewares.use(createDeepseekProxyMiddleware(deepseekApiUrl, deepseekApiKey));
        },
      },
      {
        name: "serve-external-total",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (!req.url?.startsWith("/total/")) {
              return next();
            }

            // 移除查询参数，只保留路径部分
            const urlWithoutQuery = req.url.split("?")[0];
            const relative = urlWithoutQuery.slice(7);
            
            const tryServeFile = (dir: string) => {
              const filePath = path.join(dir, relative);
              const normalized = path.normalize(filePath);
              if (!normalized.startsWith(path.normalize(dir))) {
                return false;
              }
              if (!fs.existsSync(filePath)) {
                return false;
              }
              const stat = fs.statSync(filePath);
              if (!stat.isFile()) {
                return false;
              }
              return { filePath, stat };
            };

            let fileResult = tryServeFile(publicTotalDir);
            if (!fileResult) {
              fileResult = tryServeFile(externalTotalDir);
            }

            if (!fileResult) {
              console.warn(`[serve-total] File not found in either directory: ${relative}`);
              return next();
            }

            const { filePath, stat } = fileResult;
            const mimeTypes: Record<string, string> = {
              ".mp4": "video/mp4",
              ".webm": "video/webm",
              ".m4v": "video/mp4",
              ".jpg": "image/jpeg",
              ".jpeg": "image/jpeg",
              ".png": "image/png",
              ".webp": "image/webp",
              ".json": "application/json",
              ".svg": "image/svg+xml",
            };

            const ext = path.extname(filePath).toLowerCase();
            const contentType = mimeTypes[ext] || "application/octet-stream";

            res.setHeader("Content-Type", contentType);
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Cache-Control", "public, max-age=3600");
            res.setHeader("Content-Length", stat.size);
            res.statusCode = 200;

            const stream = fs.createReadStream(filePath);
            stream.on("error", (err) => {
              console.error(`[serve-total] Stream error:`, err);
              res.statusCode = 500;
              res.end("Internal Server Error");
            });

            stream.pipe(res);
          });
        },
      },
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
    },
  };
});
