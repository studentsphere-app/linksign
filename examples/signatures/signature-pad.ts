import http from "node:http";
import chalk from "chalk";
import { type Browser, chromium } from "playwright";

export const DEFAULT_SIGNATURE =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAAAPUlEQVR42u3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO4DCa8AAZ2S13kAAAAASUVORK5CYII=";

export class PageClosedError extends Error {
	constructor(message?: string) {
		super(message || "Signature window was closed.");
		this.name = "PageClosedError";
	}
}

export function generateSignaturePadHTML(
	title = "Signature de présence",
	subtitle = "Dessinez votre signature pour valider l'émargement",
): string {
	return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    :root {
      --bg: #09090b;
      --card-bg: #121215;
      --border: #27272a;
      --text: #f4f4f5;
      --text-muted: #71717a;
      --text-dim: #a1a1aa;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    body {
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      width: 100%;
      max-width: 420px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    header {
      text-align: left;
    }
    h1 {
      font-size: 1.1rem;
      font-weight: 600;
      letter-spacing: -0.02em;
      color: var(--text);
    }
    p.subtitle {
      color: var(--text-muted);
      font-size: 0.8rem;
      margin-top: 2px;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .card-title {
      font-size: 0.775rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-dim);
    }
    .canvas-box {
      width: 100%;
      height: 120px;
      background: #ffffff;
      border-radius: 6px;
      overflow: hidden;
      cursor: crosshair;
    }
    canvas {
      width: 100%;
      height: 100%;
      display: block;
      touch-action: none;
    }
    .btn-row {
      display: flex;
      gap: 8px;
    }
    button {
      font-family: inherit;
      cursor: pointer;
      border: none;
      border-radius: 6px;
      transition: opacity 0.15s, background 0.15s;
    }
    .btn-ghost {
      background: transparent;
      color: var(--text-muted);
      font-size: 0.725rem;
      padding: 4px 8px;
    }
    .btn-ghost:hover {
      color: var(--text);
      background: rgba(255, 255, 255, 0.05);
    }
    .btn-submit {
      background: #ffffff;
      color: #09090b;
      font-weight: 500;
      font-size: 0.85rem;
      padding: 10px 16px;
      width: 100%;
      border-radius: 6px;
      margin-top: 4px;
    }
    .btn-submit:hover {
      background: #e4e4e7;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>${title}</h1>
      <p class="subtitle">${subtitle}</p>
    </header>

    <div class="card">
      <div class="card-header">
        <span class="card-title">Zone de signature</span>
        <div class="btn-row">
          <button id="clearBtn" class="btn-ghost" type="button">Effacer</button>
          <button id="exampleBtn" class="btn-ghost" type="button">Exemple</button>
        </div>
      </div>

      <div class="canvas-box">
        <canvas id="pad" width="460" height="120"></canvas>
      </div>

      <button id="submitBtn" class="btn-submit" type="button">
        Valider la signature
      </button>
    </div>
  </div>

  <script>
    const canvas = document.getElementById('pad');
    const ctx = canvas.getContext('2d');
    const clearBtn = document.getElementById('clearBtn');
    const exampleBtn = document.getElementById('exampleBtn');
    const submitBtn = document.getElementById('submitBtn');

    let isDrawing = false;
    let hasSignature = false;

    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#09090b';

    function getCanvasPos(e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    }

    function startDraw(e) {
      isDrawing = true;
      hasSignature = true;
      const { x, y } = getCanvasPos(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    }

    function draw(e) {
      if (!isDrawing) return;
      e.preventDefault();
      const { x, y } = getCanvasPos(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    function stopDraw() {
      isDrawing = false;
    }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDraw);

    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    window.addEventListener('touchend', stopDraw);

    clearBtn.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hasSignature = false;
    });

    exampleBtn.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(60, 70);
      ctx.bezierCurveTo(100, 20, 160, 90, 220, 40);
      ctx.bezierCurveTo(260, 20, 300, 80, 400, 60);
      ctx.stroke();
      hasSignature = true;
    });

    submitBtn.addEventListener('click', () => {
      const signature = hasSignature ? canvas.toDataURL('image/png') : '';
      if (window.submitSignature) {
        window.submitSignature(signature);
      }
    });
  </script>
</body>
</html>`;
}

export async function openSignaturePadWindow(
	title?: string,
	subtitle?: string,
): Promise<string> {
	const server = http.createServer((_req, res) => {
		res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
		res.end(generateSignaturePadHTML(title, subtitle));
	});

	await new Promise<void>((resolve) => {
		server.listen(0, "127.0.0.1", () => resolve());
	});

	const address = server.address();
	const port =
		typeof address === "object" && address !== null ? address.port : 8766;
	const localUrl = `http://127.0.0.1:${port}`;

	const browser: Browser = await chromium.launch({
		headless: false,
		args: ["--window-size=480,400"],
	});

	const context = await browser.newContext({
		viewport: { width: 480, height: 400 },
	});

	const page = await context.newPage();

	return new Promise<string>((resolve, reject) => {
		let completed = false;

		const cleanup = async () => {
			server.close();
			if (browser.isConnected()) {
				await browser.close();
			}
		};

		page.exposeFunction("submitSignature", async (signature: string) => {
			completed = true;
			await cleanup();
			resolve(signature || DEFAULT_SIGNATURE);
		});

		page.on("close", async () => {
			if (!completed) {
				await cleanup();
				reject(new PageClosedError());
			}
		});

		page.goto(localUrl).catch(async (err) => {
			await cleanup();
			reject(err);
		});
	});
}

export async function getSignatureWithFallback(
	promptMessage = "Opening signature window in Chromium...",
): Promise<string> {
	try {
		console.log(chalk.blue(`\n${promptMessage}`));
		const signature = await openSignaturePadWindow();
		console.log(chalk.green("✔ Signature captured successfully!"));
		return signature;
	} catch (err) {
		if (err instanceof PageClosedError) {
			console.log(
				chalk.yellow(
					"\nSignature window was closed. Using default signature fallback.",
				),
			);
		} else {
			console.warn(
				chalk.yellow(
					`\nCould not open signature pad (${err instanceof Error ? err.message : String(err)}). Using fallback.`,
				),
			);
		}
		return DEFAULT_SIGNATURE;
	}
}
