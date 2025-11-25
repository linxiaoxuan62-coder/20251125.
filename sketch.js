// 支援兩種動畫：stop (1955x212, 14 幀) 與 walk (1246x198, 8 幀)
let animations = {
	stop: { img: null, frames: 14 },
	walk: { img: null, frames: 8 }
};

let currentAnim = 'stop';
let currentFrame = 0;
let frameTimer = 0;

// 每個動畫的每幀持續時間（毫秒），可個別調整
const frameDurations = {
	stop: 100, // 10 FPS
	walk: 90   // ~11 FPS（可按需求調整）
};

function preload() {
	// 從資料夾 `1` 載入精靈圖
	animations.stop.img = loadImage('1/stop.png');
	animations.walk.img = loadImage('1/walk.png');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	noSmooth();
	imageMode(CORNER);
}

function draw() {
	// 背景色 #d5bdaf
	background('#d5bdaf');

	// 決定目前要顯示哪個動畫：按下右鍵時為 walk，否則為 stop
	const rightDown = keyIsDown(RIGHT_ARROW);
	const desiredAnim = rightDown ? 'walk' : 'stop';
	if (desiredAnim !== currentAnim) {
		currentAnim = desiredAnim;
		currentFrame = 0;
		frameTimer = 0;
	}

	const anim = animations[currentAnim];
	if (!anim || !anim.img || !anim.img.width) return;

	// 使用實際圖片尺寸計算每幀寬度
	const sw = anim.img.width;
	const sh = anim.img.height;
	const frameW = sw / anim.frames;
	const frameH = sh;

	// 使用 deltaTime 進行時間驅動的幀更新（每次僅前進一幀）
	frameTimer += deltaTime;
	const dur = frameDurations[currentAnim] || 100;
	if (frameTimer >= dur) {
		currentFrame = (currentFrame + 1) % anim.frames;
		frameTimer -= dur;
		if (frameTimer > dur) frameTimer = dur;
	}

	// 來源裁切位置
	const sx = currentFrame * frameW;
	const sy = 0;

	// 自適應縮放：讓角色高度佔畫面高度的 25%
	const targetHeightRatio = 0.25;
	const scale = (height * targetHeightRatio) / frameH;
	const displayW = frameW * scale;
	const displayH = frameH * scale;

	// 畫面置中
	const x = (width - displayW) / 2;
	const y = (height - displayH) / 2;

	// 繪製當前幀
	image(anim.img, x, y, displayW, displayH, sx, sy, frameW, frameH);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
