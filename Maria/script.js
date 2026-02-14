const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const responseMessage = document.getElementById('response-message');
const catImage = document.getElementById('cat-image');
const title = document.querySelector('.title');

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
    title.textContent = "Para mi Reyna Hermosa...";
    responseMessage.textContent = "Gracias por llenar mis días de alegría y hacer que mi corazón lata fuerte";
    responseMessage.classList.remove('hidden');
    responseMessage.classList.add('visible');

    // Move message above image
    const card = document.querySelector('.card');
    const imageContainer = document.querySelector('.image-container');
    card.insertBefore(responseMessage, imageContainer);

    // Hide buttons and dynamic message
    document.querySelector('.buttons').style.display = 'none';
    document.getElementById('dynamic-message').style.display = 'none';

    // Change background
    document.body.classList.add('love-background');

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
    "Prometo hacerte feliz",
    "No seas asi",
    "Te comprare heladito",
    "No me dejas opcion"
];

noBtn.addEventListener('click', () => {
    noClickCount++;

    // Show the message container if hidden
    dynamicMessage.classList.remove('hidden');

    if (noClickCount <= 3) {
        // Update message text
        dynamicMessage.textContent = noMessages[noClickCount - 1];
        dynamicMessage.classList.add('visible');

        // Optional: Make "Yes" button grow slightly
        const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
        yesBtn.style.fontSize = `${currentSize * 1.2}px`;
    }

    if (noClickCount === 3) {
        // Activate "run away" mode for the 4th attempt
        noBtn.addEventListener('mouseover', startEscape);
        noBtn.addEventListener('touchstart', startEscape);
    }
});

function startEscape() {
    // Update to the final message when escape starts
    dynamicMessage.textContent = noMessages[3];
    moveButton();
}

function moveButton() {
    // Add escaping class for speed and fixed positioning
    noBtn.classList.add('escaping');

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const btnRect = noBtn.getBoundingClientRect();

    // Calculate safe boundaries (padding of 20px)
    const maxX = viewportWidth - btnRect.width - 20;
    const maxY = viewportHeight - btnRect.height - 20;

    // Generate random position within safe bounds
    // Math.max(20, ...) ensures it doesn't go off the top/left edges
    const randomX = Math.max(20, Math.random() * maxX);
    const randomY = Math.max(20, Math.random() * maxY);

    // Apply new position
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;

    // Clear transform to avoid conflicts with top/left
    noBtn.style.transform = 'none';
}
