const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const responseMessage = document.getElementById('response-message');
const catImage = document.getElementById('cat-image');
const title = document.querySelector('.main-card .title');

// AQUÍ PUEDES PONER LAS FOTOS PARA CADA "NO"
const noImages = [
    "img/gato-llorando.jpg", // Foto para el primer click
    "img/gato-llorando-gif.gif", // Foto para el segundo click
    "img/gato-enojado-gif.gif"  // Foto para el tercer click
];

// AQUÍ PUEDES PONER LA FOTO PARA EL "SÍ"
const yesImage = "img/gatos-abrazados.jpg";

// MUSICA DE FONDO (Mientras decide)
const bgMusic = new Audio('music/Amor.mp3');
bgMusic.loop = true;
bgMusic.currentTime = 0; // Poner aquí los segundos de inicio (ej: 60 para 1 minuto)

// MUSICA DE ÉXITO (Cuando dice que sí)
const successMusic = new Audio('music/QuimicaMayor.mp3');
successMusic.currentTime = 0; // Poner aquí los segundos de inicio


// REFERENCIAS NUEVAS
const introScreen = document.getElementById('intro-screen');
const mainCard = document.querySelector('.main-card');

// EXPLICITAMENTE INICIAR CON INTERACCIÓN EN LA PANTALLA DE INICIO
introScreen.addEventListener('click', () => {
    // 1. Intentar reproducir música
    bgMusic.play().catch(e => console.log("Audio play failed:", e));

    // 2. Transición visual
    introScreen.style.opacity = '0';
    setTimeout(() => {
        introScreen.style.display = 'none';
        introScreen.remove(); // Ya no la necesitamos

        mainCard.classList.remove('hidden');
        mainCard.classList.add('visible'); // Por si queremos animar la entrada
    }, 500);
});

// "Sí" button interaction


// "Sí" button interaction
yesBtn.addEventListener('click', () => {
    // Confetti explosion
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff6b6b', '#ff8e8e', '#ffffff']
    });

    // Make it rain confetti for a bit
    let duration = 3 * 1000;
    let end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ff6b6b', '#ff8e8e', '#ffffff']
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ff6b6b', '#ff8e8e', '#ffffff']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());

    // Update UI
    // title.textContent = "Para mi Reyna Hermosa..."; // Replaced by typewriter logic below
    typeWriter(title, "Para mi Reyna Hermosa...❤️", 100);

    responseMessage.textContent = "Gracias por llenar mis días de alegría y hacer que mi corazón lata más fuerte. No hay nadie en el mundo con quien prefiera estar más qque contigo. ¡Te amoo!✨❤️";
    responseMessage.classList.remove('hidden');
    responseMessage.classList.add('visible');

    // Move message above image
    const card = document.querySelector('.card');
    const imageContainer = document.querySelector('.image-container');
    card.insertBefore(responseMessage, imageContainer);

    // Hide buttons and dynamic message
    document.querySelector('.buttons').style.display = 'none';
    noBtn.style.display = 'none'; // Ensure No button is hidden even if moved to body
    document.getElementById('dynamic-message').style.display = 'none';

    // Change image to the "Yes" image
    catImage.src = yesImage;

    // Change background
    document.body.classList.add('love-background');

    // Remove "No" button listeners so it stops moving/acting
    document.removeEventListener('mousemove', moveButton);
    document.removeEventListener('touchmove', moveButton);
    document.removeEventListener('touchstart', moveButton);

    // Stop background music and play success music
    bgMusic.pause();
    bgMusic.currentTime = 0; // Reset background music
    successMusic.play().catch(e => console.log("Success audio failed:", e));

    // Heart Bubbles Logic
    startHeartBubbles();
    document.addEventListener('click', createHeartOnTouch);
});

function startHeartBubbles() {
    setInterval(() => {
        createHeartBubble();
    }, 300); // New heart every 300ms
}

function createHeartOnTouch(e) {
    // Create multiple hearts on click
    for (let i = 0; i < 5; i++) {
        createHeartBubble(e.clientX, e.clientY);
    }
}

function createHeartBubble(x, y) {
    const heart = document.createElement('div');
    heart.classList.add('heart-bubble');
    heart.textContent = Math.random() > 0.5 ? '❤️' : '💖'; // Random heart emoji

    // Position
    if (x && y) {
        // From click
        heart.style.left = `${x + (Math.random() * 40 - 20)}px`;
        heart.style.top = `${y + (Math.random() * 40 - 20)}px`;
    } else {
        // Random bottom position
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = '100vh';
    }

    // Randomize size and speed via CSS var or direct style if needed
    const size = Math.random() * 1.5 + 1; // 1x to 2.5x
    heart.style.fontSize = `${size}rem`;

    const duration = Math.random() * 3 + 2; // 2-5s
    heart.style.animationDuration = `${duration}s`;

    document.body.appendChild(heart);

    // Cleanup
    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

// "No" button interaction
let noClickCount = 0;
const dynamicMessage = document.getElementById('dynamic-message');
const noMessages = [
    "Prometo hacerte muy feliz ❤️",
    "No seas asi :C",
    "Te comprare heladito...",
    "No me dejas opcion 👿"
];

noBtn.addEventListener('click', () => {
    noClickCount++;

    // Show the message container if hidden
    dynamicMessage.classList.remove('hidden');

    if (noClickCount <= 3) {
        // Update message text
        dynamicMessage.textContent = noMessages[noClickCount];
        dynamicMessage.classList.add('visible');

        // Change image
        if (noImages[noClickCount - 1]) {
            catImage.src = noImages[noClickCount - 1];
        }

        // Optional: Make "Yes" button grow slightly
        const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
        yesBtn.style.fontSize = `${currentSize * 1.2}px`;
    }

    if (noClickCount === 3) {
        // TELEPORT (Instant move to random spot)
        const rect = noBtn.getBoundingClientRect();

        // Move to body if not already
        if (noBtn.parentNode !== document.body) {
            document.body.appendChild(noBtn);
            noBtn.style.position = 'fixed';
        }

        // Disable transition for instant teleport
        noBtn.style.transition = 'none';

        // Calculate random position (safe padding)
        const randomX = Math.random() * (window.innerWidth - rect.width - 40) + 20;
        const randomY = Math.random() * (window.innerHeight - rect.height - 40) + 20;

        noBtn.style.left = `${randomX}px`;
        noBtn.style.top = `${randomY}px`;

        // Force reflow/repaint so the teleport happens instantly
        noBtn.offsetHeight;

        // Restore transition (will be handled by css class later)
        noBtn.style.transition = '';

        // Ahora que se ha movido, activamos el modo "huir" para la próxima vez que se acerque
        noBtn.addEventListener('mouseover', startFleeing);
        noBtn.addEventListener('touchstart', startFleeing);
    }
});

function startFleeing(event) {
    // Add class for smooth movement
    noBtn.classList.add('escaping');

    // Add global listeners to detect proximity even if button is missed/tiny
    document.addEventListener('mousemove', moveButton);
    document.addEventListener('touchmove', moveButton);
    document.addEventListener('touchstart', moveButton);

    moveButton(event);
}

function moveButton(event) {
    if (!event) return; // Guard clause

    // Handle touch events which might have touches array
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    const padding = 20;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const btnRect = noBtn.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const mouseX = clientX;
    const mouseY = clientY;

    // Calculate vector from mouse to button center
    let deltaX = btnCenterX - mouseX;
    let deltaY = btnCenterY - mouseY;

    // Distance between mouse and button center
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // If mouse is too close (e.g., within 150px), move away
    // If it's already far enough, don't move drastically
    const safeDistance = 150; // Reduced from 150 for allowing closer approach

    if (distance < safeDistance) {
        // Normalize vector
        const normX = deltaX / distance;
        const normY = deltaY / distance;

        // Move to safe distance + a little extra nudge (Reduced nudge for less jumping)
        let targetX = mouseX + (normX * (safeDistance + 30));
        let targetY = mouseY + (normY * (safeDistance + 30));

        // Clamp to screen
        targetX = Math.max(padding, Math.min(targetX, viewportWidth - btnRect.width - padding));
        targetY = Math.max(padding, Math.min(targetY, viewportHeight - btnRect.height - padding));

        noBtn.style.left = `${targetX}px`;
        noBtn.style.top = `${targetY}px`;

        // Mobile/Success-forcing mechanic: 
        // Shrink "No" button and grow "Yes" button on each attempt

        // Get current scale or default to 1
        let noScale = parseFloat(noBtn.getAttribute('data-scale')) || 1;
        let yesScale = parseFloat(yesBtn.getAttribute('data-scale')) || 1;

        // Update scales (shrink No, grow Yes)
        noScale -= 0.002; // Much slower shrinking
        if (noScale < 0) noScale = 0; // Prevent inversion
        yesScale += 0.002; // Much slower growing

        // Apply scales
        noBtn.style.transform = `scale(${noScale})`;
        yesBtn.style.transform = `scale(${yesScale})`;

        // Store new values
        noBtn.setAttribute('data-scale', noScale);
        yesBtn.setAttribute('data-scale', yesScale);
    }
}

// Función efecto de escritura (Typewriter)
function typeWriter(element, text, speed) {
    element.textContent = "";
    let i = 0;
    function type() {
        if (i < text.length) {
            // Check for emoji (surrogate pairs) or standard char
            // Simple approach: just append char
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}
