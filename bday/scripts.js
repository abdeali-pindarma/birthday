const now = new Date();
const birthdayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1); // 1-min test
const countdownEl = document.getElementById('countdown');
const countdownContainer = document.getElementById('countdownContainer');

function updateCountdown() {
    const diff = Math.max(0, (birthdayDate - new Date()) / 1000);
    if (diff <= 0) {
        countdownContainer.style.display = 'none';
        document.getElementById('loginScreen').style.display = 'block';
        return;
    }
    const min = Math.floor(diff / 60).toString().padStart(2, 0);
    const sec = Math.floor(diff % 60).toString().padStart(2, 0);
    countdownEl.textContent = `${min}:${sec}`;
    setTimeout(updateCountdown, 900);
}
updateCountdown();

function startCelebration() {
    const name = document.getElementById('wisherName').value.trim();
    if (!name) { alert("Please enter your name!"); return; }
    document.getElementById('wisherGreet').textContent = `From: ${name}`;
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('celebrationContent').style.display = 'block';
    playConfetti();
    document.getElementById('bdaySong').play();
    drawCandles();
}

function playConfetti() {
    const c = document.getElementById('confetti-canvas'),
        ctx = c.getContext('2d');
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    for (let i = 0; i < 130; i++) {
        setTimeout(() => {
            ctx.fillStyle = `hsl(${360*Math.random()},90%,60%)`;
            ctx.beginPath();
            ctx.arc(Math.random() * c.width, Math.random() * c.height * 0.8, 7 + 8 * Math.random(), 0, Math.PI * 2);
            ctx.fill();
        }, i * 10);
    }
    setTimeout(() => ctx.clearRect(0, 0, c.width, c.height), 2600);
}

function drawCandles() {
    const candlesDiv = document.getElementById('candles');
    candlesDiv.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const candle = document.createElement('div');
        candle.className = 'candle-flame';
        candle.id = 'candle' + i;
        candlesDiv.appendChild(candle);
    }
}

function blowCandles() {
    [...document.querySelectorAll('.candle-flame')].forEach(c => {
        c.style.opacity = 0.13;
        c.style.transition = "opacity 0.7s";
    });
    setTimeout(() => {
        playConfetti();
        alert('Candles are blown! Make a wish!');
    }, 700)
}

function playGame() {
    document.getElementById('gameModal').style.display = 'block';
    startGame();
}

function closeGame() { document.getElementById('gameModal').style.display = 'none'; }

function openMemoryWall() { document.getElementById('memoryWall').style.display = 'block'; }

function closeMemoryWall() { document.getElementById('memoryWall').style.display = 'none'; }

let messages = [];

function submitMessage() {
    const msg = document.getElementById('guestMsg').value.trim();
    const photoInput = document.getElementById('guestPhoto');
    if (!msg && photoInput.files.length === 0) return; // require at least one

    if (photoInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const photoBase64 = e.target.result;
            messages.push({ text: msg, photo: photoBase64 });
            updateMessages();
            resetGuestbookInput();
        }
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        messages.push({ text: msg, photo: null });
        updateMessages();
        resetGuestbookInput();
    }
}

function updateMessages() {
    document.getElementById('messages').innerHTML = messages.map(e => {
        let photoHtml = e.photo ? `<img src="${e.photo}" alt="Guest Photo" class="guest-photo" />` : '';
        let textHtml = e.text ? `<p>🎉 ${e.text}</p>` : '';
        return `<div class="guest-entry">${photoHtml}${textHtml}</div>`;
    }).join('');
}

function resetGuestbookInput() {
    document.getElementById('guestMsg').value = "";
    document.getElementById('guestPhoto').value = "";
}

// Tiny whack-a-bug game
function startGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 140;
    let score = 0,
        bugs = [];

    function drawBug(x) {
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(x, 100, 12, 0, 2 * Math.PI);
        ctx.fill();
    }

    function spawn() {
        bugs = [40 + Math.random() * 220];
    }

    function draw() {
        ctx.clearRect(0, 0, 300, 140);
        bugs.forEach(drawBug);
    }

    spawn();
    draw();

    canvas.onclick = (ev) => {
        const x = ev.offsetX;
        if (bugs.some(b => Math.abs(x - b) < 20)) {
            score += 1;
            spawn();
            draw();
        }
        document.getElementById('gameScore').textContent = "Score: " + score;
    }
}

// Marvel/Thor mode toggle
function toggleMarvel() {
    document.body.classList.toggle('marvel');
}