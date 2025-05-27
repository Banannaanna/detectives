// ===== GLOBAL STATE =====
let currentLevel = 0;
let foundCats = 0;
const catCounts = [3, 5, 6];

// ===== ELEMENTS =====
const startScreen = document.getElementById('start-screen');
const gameplay = document.getElementById('gameplay');
const completeScreen = document.getElementById('level-complete');
const startButton = document.getElementById('start-button');
const beginLevelButtons = document.querySelectorAll('.level-button');
const nextLevelButtons = document.querySelectorAll('.next-level-button');

// ===== SCREEN SWITCHING =====
startButton.addEventListener('click', () => {
  startScreen.classList.add('hidden');
  showIntroScreen(currentLevel);
});

beginLevelButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentLevel = parseInt(btn.dataset.level) - 1;
    hideAllScreens();
    gameplay.classList.remove('hidden');
    startLevel();
  });
});


nextLevelButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const next = btn.dataset.level;
  
    completeScreen.classList.add('hidden');
  
    if (next === 'gift') {
      document.getElementById('gift-screen').classList.remove('hidden');
    } else {
      currentLevel = parseInt(next) - 1;
      showIntroScreen(currentLevel);
    }
  });
});



function hideAllScreens() {
  document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
}

function showIntroScreen(level) {
  hideAllScreens();
  const intro = document.getElementById(`level-${level + 1}-intro`);
  if (intro) intro.classList.remove('hidden');
}

function showLevelVisuals(level) {
  const frame = document.querySelector('.level-frame');
  frame.className = 'level-frame';
  frame.classList.add(`level-${level + 1}`);

  document.querySelectorAll('.level-image').forEach(img => img.classList.add('hidden'));
  const currentImg = document.querySelector(`.level-image-lvl-${level + 1}`);
  if (currentImg) currentImg.classList.remove('hidden');
}

function showLevelMasks(level) {
  document.querySelectorAll('.cat-masks').forEach(group => group.classList.add('hidden'));
  const current = document.querySelector(`.cat-masks-lvl-${level + 1}`);
  if (current) current.classList.remove('hidden');
}

function updateCompleteScreen(level) {
  document.querySelectorAll('[id^="level-complete-bg"]').forEach(bg => bg.classList.add('hidden'));
  document.querySelectorAll('[id^="level-complete-coin"]').forEach(coin => coin.classList.add('hidden'));
  document.querySelectorAll('[id^="level-complete-text"]').forEach(text => text.classList.add('hidden'));
  document.querySelectorAll('.next-level-button').forEach(btn => btn.classList.add('hidden'));
  document.getElementById('gift-screen').classList.add('hidden');

  const bg = document.getElementById(`level-complete-bg-${level + 1}`);
  const coin = document.getElementById(`level-complete-coin-${level + 1}`);
  const text = document.getElementById(`level-complete-text-${level + 1}`);

  if (bg) bg.classList.remove('hidden');
  if (coin) coin.classList.remove('hidden');
  if (text) text.classList.remove('hidden');

  const allButtons = document.querySelectorAll('.next-level-button');
  allButtons.forEach(btn => {
    const btnLevel = btn.dataset.level;
    const isGift = btnLevel === 'gift';
    const isCorrectNext = parseInt(btnLevel) === level + 2; // levels are 0-based

    if ((isCorrectNext && level < 2) || (level === 2 && isGift)) {
      btn.classList.remove('hidden');
      btn.textContent = isGift ? 'Get Your Gift' : 'Next Level';
    } else {
      btn.classList.add('hidden');
    }
  });
}


function startLevel() {
  foundCats = 0;
  const totalCats = catCounts[currentLevel] || 3;

  document.querySelector('.level-indicator').textContent = `LVL: ${currentLevel + 1}`;
  document.getElementById('found-cats').textContent = foundCats;
  document.getElementById('total-cats').textContent = totalCats;

  renderProgressBar(totalCats);
  showLevelVisuals(currentLevel);
  showLevelMasks(currentLevel);
  bindMaskClicks(totalCats);
  updateCompleteScreen(currentLevel);
}

function bindMaskClicks(totalCats) {
  const maskContainer = document.querySelector(`.cat-masks-lvl-${currentLevel + 1}`);
  const masks = maskContainer.querySelectorAll('.cat-mask');

  masks.forEach((mask, index) => {
    mask.addEventListener('click', () => {
      if (mask.classList.contains('found')) return;

      mask.classList.add('found');
      flyMaskToCoin(mask, foundCats);
      updateCoin(foundCats);

      foundCats++;
      document.getElementById('found-cats').textContent = foundCats;

      if (foundCats >= totalCats) {
        setTimeout(() => {
          gameplay.classList.add('hidden');
          completeScreen.classList.remove('hidden');
          updateCompleteScreen(currentLevel);
        }, 800);
      }
    });
  });
}

function flyMaskToCoin(mask, index) {
  const parent = document.querySelector('.level-frame');
  const clone = mask.cloneNode(true);
  parent.appendChild(clone);

  const maskRect = mask.getBoundingClientRect();
  const coin = document.querySelectorAll('.coin')[index];
  if (!coin) return;

  const coinRect = coin.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();

  const startX = maskRect.left - parentRect.left;
  const startY = maskRect.top - parentRect.top;
  const endX = coinRect.left - parentRect.left;
  const endY = coinRect.top - parentRect.top;

  Object.assign(clone.style, {
    position: 'absolute',
    top: `${startY}px`,
    left: `${startX}px`,
    width: `${mask.offsetWidth}px`,
    height: `${mask.offsetHeight}px`,
    background: 'rgba(255,255,102,0.9)',
    transition: 'all 0.6s ease-in-out',
    pointerEvents: 'none',
    zIndex: 9999,
  });

  requestAnimationFrame(() => {
    clone.style.top = `${endY}px`;
    clone.style.left = `${endX}px`;
    clone.style.transform = 'scale(0.4)';
    clone.style.opacity = '0.1';
  });

  setTimeout(() => clone.remove(), 700);
}


function renderProgressBar(totalCats) {
  const bar = document.getElementById('progress-bar');
  bar.innerHTML = '';

  for (let i = 0; i < totalCats; i++) {
    const coin = document.createElement('img');
    coin.src = 'assets/images/coin_uact.png';
    coin.classList.add('coin');
    coin.dataset.index = i;
    bar.appendChild(coin);
  }
}

function updateCoin(index) {
  const coins = document.querySelectorAll('.coin');
  if (coins[index]) {
    coins[index].src = 'assets/images/coin_act.png';
    coins[index].style.transform = 'scale(1.2)';
    setTimeout(() => coins[index].style.transform = 'scale(1)', 200);
  }
}

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}
