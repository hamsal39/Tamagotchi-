// --- 1. GAME STATE ---
let pet = {
    hunger: 100,   // 100 = Full, 0 = Starving
    happiness: 100, // 100 = Happy, 0 = Sad
    energy: 100,    // 100 = Energized, 0 = Exhausted
    isSleeping: false,
    isDead: false
};

// DOM Elements
const petDisplay = document.getElementById('pet');
const messageDisplay = document.getElementById('message');
const hungerBar = document.getElementById('hunger-bar');
const happyBar = document.getElementById('happy-bar');
const energyBar = document.getElementById('energy-bar');
const btnFeed = document.getElementById('btn-feed');
const btnPlay = document.getElementById('btn-play');
const btnSleep = document.getElementById('btn-sleep');
const restartSection = document.getElementById('restart-btn');

// --- 2. THE "AI" LOGIC (Decision Engine) ---
// This runs every 2 seconds to simulate the pet's thought process
function aiDecisionLoop() {
    if (pet.isDead) return;

    // Natural stat decay
    if (!pet.isSleeping) {
        pet.hunger -= 2;
        pet.happiness -= 1;
        pet.energy -= 1;
    } else {
        // Sleeping restores energy
        if (pet.energy < 100) pet.energy += 5;
        // But hunger still drops while sleeping
        pet.hunger -= 1; 
    }

    // --- AI DECISION TREE ---
    // The pet "decides" what to express based on its state
    
    if (pet.isSleeping) {
        setPetStatus("💤", "Zzz...");
    } 
    else if (pet.hunger <= 0 || pet.happiness <= 0) {
        setPetStatus("💀", "Game Over!");
        pet.isDead = true;
        clearInterval(gameLoop);
        btnFeed.disabled = true;
        btnPlay.disabled = true;
        btnSleep.disabled = true;
        restartSection.classList.remove('hidden');
    }
    else if (pet.hunger < 30) {
        setPetStatus("🥺", "Hungry! Feed me!");
        pet.happiness -= 1; // Sadness from hunger
    }
    else if (pet.happiness < 30) {
        setPetStatus("😫", "Bored! Play with me!");
        pet.energy -= 1; // Frustration drains energy
    }
    else if (pet.energy < 20) {
        setPetStatus("😴", "So tired...");
    }
    else {
        // Random happy idle states
        const idleEmojis = ["👾", "✨", "🐱", "🐶"];
        const randomEmoji = idleEmojis[Math.floor(Math.random() * idleEmojis.length)];
        setPetStatus(randomEmoji, "Chilling...");
    }

    updateDisplay();
}

// --- 3. USER CONTROLS ---

function feed() {
    if (pet.isSleeping || pet.isDead) return;
    
    pet.hunger = Math.min(pet.hunger + 30, 100);
    pet.energy -= 5; // Digestion cost
    
    animatePet('bounce');
    setPetStatus("😋", "Yummy!");
    updateDisplay();
}

function play() {
    if (pet.isSleeping || pet.isDead) return;
    
    if (pet.energy < 20) {
        setPetStatus("😫", "Too tired to play!");
        return;
    }
    
    pet.happiness = Math.min(pet.happiness + 30, 100);
    pet.hunger -= 15; // Playing burns calories
    pet.energy -= 20;
    
    animatePet('shake');
    setPetStatus("😄", "Fun!");
    updateDisplay();
}

function sleep() {
    if (pet.isDead) return;

    pet.isSleeping = !pet.isSleeping;
    
    if (pet.isSleeping) {
        setPetStatus("💤", "Sleeping...");
    } else {
        setPetStatus("👾", "Woke up!");
    }
    updateDisplay();
}

// --- 4. HELPER FUNCTIONS ---

function setPetStatus(emoji, text) {
    petDisplay.innerText = emoji;
    messageDisplay.innerText = text;
}

function animatePet(animationClass) {
    petDisplay.classList.remove('animate-bounce', 'animate-shake');
    // Trigger reflow to restart animation
    void petDisplay.offsetWidth; 
    petDisplay.classList.add('animate-' + animationClass);
}

function updateDisplay() {
    // Clamp values
    pet.hunger = Math.max(0, Math.min(pet.hunger, 100));
    pet.happiness = Math.max(0, Math.min(pet.happiness, 100));
    pet.energy = Math.max(0, Math.min(pet.energy, 100));

    // Update widths
    hungerBar.style.width = pet.hunger + "%";
    happyBar.style.width = pet.happiness + "%";
    energyBar.style.width = pet.energy + "%";

    // Update colors based on level
    updateBarColor(hungerBar, pet.hunger);
    updateBarColor(happyBar, pet.happiness);
    updateBarColor(energyBar, pet.energy);
}

function updateBarColor(barElement, value) {
    barElement.classList.remove('low', 'critical');
    if (value <= 20) {
        barElement.classList.add('critical');
    } else if (value <= 50) {
        barElement.classList.add('low');
    }
}

// --- 5. INITIALIZATION ---
// Run the AI loop every 2 seconds
const gameLoop = setInterval(aiDecisionLoop, 2000);

// Event Listeners
btnFeed.addEventListener('click', feed);
btnPlay.addEventListener('click', play);
btnSleep.addEventListener('click', sleep);

// Initial render
updateDisplay();