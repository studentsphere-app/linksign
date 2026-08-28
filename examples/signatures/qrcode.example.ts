import { randomUUID } from "node:crypto";
import http from "node:http";
import { input } from "@inquirer/prompts";
import chalk from "chalk";
import { type Browser, chromium } from "playwright";
import { signByQRCode } from "../../src/services/signatures";
import { authenticate } from "../auth/credentials.example";

const DEFAULT_SIGNATURE =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAAAPUlEQVR42u3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO4DCa8AAZ2S13kAAAAASUVORK5CYII=";

class PageClosedError extends Error {
	constructor(message?: string) {
		super(message || "Browser window was closed.");
		this.name = "PageClosedError";
	}
}

interface ScanResult {
	qrCodeId: string;
	courseId: string;
	signature: string;
}

function generateScannerHTML(): string {
	return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Émargement QR Code</title>
  <script src="https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js"></script>
  <style>
    :root {
      --bg: #09090b;
      --card-bg: #121215;
      --border: #27272a;
      --border-subtle: #1f1f23;
      --text: #f4f4f5;
      --text-muted: #71717a;
      --text-dim: #a1a1aa;
      --accent: #ffffff;
      --success: #22c55e;
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
      padding: 24px 16px 32px;
    }
    .container {
      width: 100%;
      max-width: 460px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    header {
      margin-bottom: 4px;
    }
    h1 {
      font-size: 1.15rem;
      font-weight: 600;
      letter-spacing: -0.02em;
      color: var(--text);
    }
    p.subtitle {
      color: var(--text-muted);
      font-size: 0.8rem;
      margin-top: 2px;
    }
    .section {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .section-title {
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-dim);
    }
    .scanner-box {
      position: relative;
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
      background: #000;
      aspect-ratio: 16 / 10;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border-subtle);
    }
    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .reticle {
      position: absolute;
      width: 150px;
      height: 150px;
      border: 1.5px solid rgba(255, 255, 255, 0.4);
      border-radius: 8px;
      pointer-events: none;
    }
    .camera-meta {
      position: absolute;
      bottom: 8px;
      left: 8px;
      right: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(9, 9, 11, 0.8);
      backdrop-filter: blur(8px);
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.725rem;
      color: var(--text-dim);
    }
    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--text-muted);
      display: inline-block;
      margin-right: 6px;
    }
    .status-dot.active { background: var(--success); }
    .dropzone {
      border: 1px dashed var(--border);
      border-radius: 8px;
      padding: 10px;
      text-align: center;
      font-size: 0.775rem;
      color: var(--text-muted);
      cursor: pointer;
      background: rgba(255, 255, 255, 0.02);
      transition: border-color 0.15s, background 0.15s;
    }
    .dropzone:hover, .dropzone.dragover {
      border-color: #52525b;
      background: rgba(255, 255, 255, 0.04);
      color: var(--text);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 0.775rem;
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.3);
      color: var(--success);
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    label {
      font-size: 0.725rem;
      color: var(--text-muted);
    }
    input[type="text"] {
      background: #09090b;
      border: 1px solid var(--border);
      color: var(--text);
      padding: 8px 10px;
      border-radius: 6px;
      font-size: 0.825rem;
      outline: none;
      transition: border-color 0.15s;
    }
    input[type="text"]:focus {
      border-color: #52525b;
    }
    .canvas-box {
      width: 100%;
      height: 100px;
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
      justify-content: flex-end;
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
      <h1>Émargement</h1>
      <p class="subtitle">Scannez le QR Code ou renseignez les informations</p>
    </header>

    <!-- Scan -->
    <div class="section">
      <div class="section-header">
        <span class="section-title">QR Code</span>
        <button id="retryCamBtn" class="btn-ghost" type="button">Relancer caméra</button>
      </div>

      <div class="scanner-box">
        <video id="video" playsinline autoplay muted></video>
        <div class="reticle"></div>
        <div class="camera-meta">
          <div><span id="camDot" class="status-dot"></span><span id="camStatusText">Caméra en attente</span></div>
          <span>Coller (Cmd+V)</span>
        </div>
      </div>

      <div class="dropzone" id="dropZone">
        Glisser une image, cliquer pour importer ou faire Cmd+V
        <input type="file" id="qrFileInput" accept="image/*" style="display: none;" />
      </div>

      <div id="scannedBadge" class="badge" style="display: none;">
        ✔ QR Code détecté
      </div>

      <div class="grid-2">
        <div class="field">
          <label for="qrCodeId">QR Code ID / Payload</label>
          <input type="text" id="qrCodeId" placeholder="123456" />
        </div>
        <div class="field">
          <label for="courseId">Course ID</label>
          <input type="text" id="courseId" placeholder="Optionnel" />
        </div>
      </div>
    </div>

    <!-- Signature -->
    <div class="section">
      <div class="section-header">
        <span class="section-title">Signature</span>
        <div class="btn-row">
          <button id="clearSigBtn" class="btn-ghost" type="button">Effacer</button>
          <button id="defaultSigBtn" class="btn-ghost" type="button">Exemple</button>
        </div>
      </div>

      <div class="canvas-box">
        <canvas id="signaturePad" width="500" height="100"></canvas>
      </div>

      <button id="submitBtn" class="btn-submit" type="button">
        Valider l'émargement
      </button>
    </div>
  </div>

  <script>
    const video = document.getElementById('video');
    const camDot = document.getElementById('camDot');
    const camStatusText = document.getElementById('camStatusText');
    const qrCodeIdInput = document.getElementById('qrCodeId');
    const courseIdInput = document.getElementById('courseId');
    const scannedBadge = document.getElementById('scannedBadge');
    const dropZone = document.getElementById('dropZone');
    const qrFileInput = document.getElementById('qrFileInput');
    const retryCamBtn = document.getElementById('retryCamBtn');
    const canvas = document.getElementById('signaturePad');
    const ctx = canvas.getContext('2d');
    const clearBtn = document.getElementById('clearSigBtn');
    const defaultSigBtn = document.getElementById('defaultSigBtn');
    const submitBtn = document.getElementById('submitBtn');

    let isDrawing = false;
    let hasSignature = false;
    let scanning = true;
    let stream = null;

    function parseQRCodePayload(content) {
      if (!content) return;
      let qId = '';
      let cId = '';

      try {
        const json = JSON.parse(content);
        qId = json.qrcodeid || json.qrCodeId || json.id || json.qrcodeId || '';
        cId = json.courseId || json.courseid || json.c || '';
      } catch {
        if (content.startsWith('http://') || content.startsWith('https://')) {
          try {
            const url = new URL(content);
            qId = url.searchParams.get('qrcodeid') || url.searchParams.get('q') || url.searchParams.get('id') || '';
            cId = url.searchParams.get('courseId') || url.searchParams.get('c') || '';
          } catch (_) {}
        }
      }

      if (!qId && !cId) {
        qId = content.trim();
      }

      if (qId) qrCodeIdInput.value = qId;
      if (cId) courseIdInput.value = cId;

      scannedBadge.style.display = 'inline-flex';
    }

    const scanCanvas = document.createElement('canvas');
    const scanCtx = scanCanvas.getContext('2d', { willReadFrequently: true });

    async function decodeCanvas(c, cx) {
      if ('BarcodeDetector' in window) {
        try {
          const detector = new BarcodeDetector({ formats: ['qr_code'] });
          const barcodes = await detector.detect(c);
          if (barcodes.length > 0 && barcodes[0].rawValue) {
            parseQRCodePayload(barcodes[0].rawValue);
            return true;
          }
        } catch (_) {}
      }

      if (window.jsQR) {
        const imgData = cx.getImageData(0, 0, c.width, c.height);
        const code = window.jsQR(imgData.data, imgData.width, imgData.height, {
          inversionAttempts: 'dontInvert',
        });
        if (code && code.data) {
          parseQRCodePayload(code.data);
          return true;
        }
      }
      return false;
    }

    async function startCamera() {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
      camDot.className = 'status-dot';
      camStatusText.textContent = 'Connexion...';

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
        video.srcObject = stream;
        video.setAttribute('playsinline', 'true');
        video.muted = true;
        await video.play();

        camDot.className = 'status-dot active';
        camStatusText.textContent = 'Caméra active';
        requestAnimationFrame(tick);
      } catch (err) {
        console.warn('Camera error:', err);
        camDot.className = 'status-dot';
        camStatusText.textContent = 'Caméra non disponible';
      }
    }

    async function tick() {
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && scanning) {
        scanCanvas.height = video.videoHeight;
        scanCanvas.width = video.videoWidth;
        scanCtx.drawImage(video, 0, 0, scanCanvas.width, scanCanvas.height);
        await decodeCanvas(scanCanvas, scanCtx);
      }
      if (stream && stream.active) {
        requestAnimationFrame(tick);
      }
    }

    retryCamBtn.addEventListener('click', () => startCamera());
    startCamera();

    function processImageFile(file) {
      const img = new Image();
      img.onload = async () => {
        scanCanvas.width = img.width;
        scanCanvas.height = img.height;
        scanCtx.drawImage(img, 0, 0);
        const found = await decodeCanvas(scanCanvas, scanCtx);
        if (!found) {
          alert('Aucun QR Code détecté dans cette image.');
        }
      };
      img.src = URL.createObjectURL(file);
    }

    dropZone.addEventListener('click', () => qrFileInput.click());
    qrFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) processImageFile(file);
    });

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file) processImageFile(file);
    });

    window.addEventListener('paste', (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) processImageFile(file);
        }
      }
    });

    // Signature Pad
    ctx.lineWidth = 2;
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

    defaultSigBtn.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(60, 60);
      ctx.bezierCurveTo(100, 20, 160, 80, 220, 35);
      ctx.bezierCurveTo(260, 20, 300, 70, 420, 50);
      ctx.stroke();
      hasSignature = true;
    });

    submitBtn.addEventListener('click', () => {
      const qrCodeId = qrCodeIdInput.value.trim();
      const courseId = courseIdInput.value.trim();

      if (!qrCodeId) {
        alert('Veuillez scanner ou renseigner un QR Code ID.');
        return;
      }

      const signature = hasSignature ? canvas.toDataURL('image/png') : '';

      if (window.submitSignature) {
        window.submitSignature({
          qrCodeId,
          courseId,
          signature
        });
      }
    });
  </script>
</body>
</html>`;
}

async function openScannerWindow(): Promise<ScanResult> {
	const server = http.createServer((_req, res) => {
		res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
		res.end(generateScannerHTML());
	});

	await new Promise<void>((resolve) => {
		server.listen(0, "127.0.0.1", () => resolve());
	});

	const address = server.address();
	const port =
		typeof address === "object" && address !== null ? address.port : 8765;
	const localUrl = `http://127.0.0.1:${port}`;

	const browser: Browser = await chromium.launch({
		headless: false,
		args: ["--window-size=580,840"],
	});

	const context = await browser.newContext({
		viewport: { width: 580, height: 840 },
		permissions: ["camera"],
	});

	await context.grantPermissions(["camera"], { origin: localUrl });
	const page = await context.newPage();

	return new Promise<ScanResult>((resolve, reject) => {
		let completed = false;

		const cleanup = async () => {
			server.close();
			if (browser.isConnected()) {
				await browser.close();
			}
		};

		page.exposeFunction("submitSignature", async (data: ScanResult) => {
			completed = true;
			await cleanup();
			resolve(data);
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

export async function signWithQRCode(passedToken?: string) {
	console.log(
		chalk.bold.magenta("\n--- Edusign Signature by QR Code Example ---"),
	);

	let token = passedToken;
	if (!token) {
		const user = await authenticate();
		token = user.TOKEN;
	}

	let qrCodeId = "";
	let courseId = "";
	let signature = DEFAULT_SIGNATURE;

	try {
		console.log(
			chalk.blue(
				"\nOpening Chromium window for QR Code scanning & signature...",
			),
		);
		const scanResult = await openScannerWindow();
		qrCodeId = scanResult.qrCodeId;
		courseId = scanResult.courseId;
		if (scanResult.signature) {
			signature = scanResult.signature;
		}
		console.log(chalk.green(`✔ QR Code data captured: ID=${qrCodeId}`));
	} catch (err) {
		if (err instanceof PageClosedError) {
			console.log(
				chalk.yellow(
					"\nBrowser window was closed. Falling back to terminal input.",
				),
			);
		} else {
			console.warn(
				chalk.yellow(
					`\nCould not open browser scanner (${err instanceof Error ? err.message : String(err)}). Falling back to terminal input.`,
				),
			);
		}

		qrCodeId = await input({
			message: chalk.cyan("Enter the QR Code ID:"),
			required: true,
		});

		courseId = await input({
			message: chalk.cyan("Enter the Course ID:"),
			required: true,
		});
	}

	if (!courseId) {
		courseId = await input({
			message: chalk.cyan("Enter the Course ID (if required):"),
			default: "0",
		});
	}

	console.log(
		chalk.blue(`\nSubmitting QR Code attendance for qrcodeId "${qrCodeId}"...`),
	);

	try {
		const uuid = randomUUID();
		const result = await signByQRCode(token, qrCodeId, {
			signature,
			courseId,
			UUID: uuid,
			Model: "Web - firefox - Firefox 153",
		});

		console.log(chalk.green("\n✔ Attendance successfully signed by QR Code!"));
		console.log(chalk.white(JSON.stringify(result, null, 2)));
		return result;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error(
			chalk.red("\n✖ Error signing attendance by QR Code:"),
			errorMessage,
		);
	}
}

const isMain = process.argv[1]?.includes("qrcode.example");
if (isMain) {
	signWithQRCode().catch(console.error);
}
