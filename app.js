class Tamagotchi {
    constructor(name) {
        this.name = name;
        this.hunger = 100;
        this.sleepiness = 100;
        this.boredom = 100;
        this.age = 0;
        this.isAlive = true;
        this.intervalIds = [];
        this.animateIntervalId = null; // Stores the animation interval
    }

    // UI helpers
    updateBar(id, value) {
        const el = document.getElementById(id);
        el.style.width = Math.min(100, Math.max(0, value)) + "%";
        // Change color based on value
        if (value > 50) el.style.backgroundColor = "#2BC253";
        else if (value >= 30) el.style.backgroundColor = "orange";
        else el.style.backgroundColor = "red";
    }

    checkCrying() {
        const pic = document.getElementById('greeting');
        // If any stat is low, cry. Otherwise, show normal.
        if (this.hunger < 30 || this.sleepiness < 30 || this.boredom < 30) {
            pic.src = "pic/cry.png";
        } else {
            // Only reset to born if we aren't currently sleeping/eating/playing.
            // To keep it simple, we default back to born when all stats are good.
            // The button clicks manually change the image, and this function won't overwrite them 
            // until the next stat decrease happens. 
            // We'll let the buttons override it, but if we are crying, we override the buttons.
            if (pic.src.includes('cry.png')) {
                pic.src = "pic/born.png";
            }
        }
    }

    // Start the game loop
    start() {
        const pic = document.getElementById('greeting');
        pic.src = "pic/born.png";
        document.getElementById('audio').play();

        this.intervalIds.push(setInterval(() => this.increaseAge(), 20000));
        this.intervalIds.push(setInterval(() => this.decreaseHunger(), 7000));
        this.intervalIds.push(setInterval(() => this.decreaseSleepiness(), 7000));
        this.intervalIds.push(setInterval(() => this.decreaseBoredom(), 7000));
        this.animate();
    }

    increaseAge() {
        if (!this.isAlive) return;
        this.age++;
        document.getElementById("age").innerHTML = this.age;
    }

    decreaseHunger() {
        if (!this.isAlive) return;
        this.hunger = Math.max(0, this.hunger - 5);
        this.updateBar("hungerlevel", this.hunger);
        this.checkCrying();
        if (this.hunger <= 0) this.die();
    }

    decreaseSleepiness() {
        if (!this.isAlive) return;
        this.sleepiness = Math.max(0, this.sleepiness - 5);
        this.updateBar("sleepinesslevel", this.sleepiness);
        this.checkCrying();
        if (this.sleepiness <= 0) this.die();
    }

    decreaseBoredom() {
        if (!this.isAlive) return;
        this.boredom = Math.max(0, this.boredom - 5);
        this.updateBar("boredomlevel", this.boredom);
        this.checkCrying();
        if (this.boredom <= 0) this.die();
    }

    increaseHunger() {
        if (!this.isAlive) return;
        this.hunger = Math.min(100, this.hunger + 10);
        this.updateBar("hungerlevel", this.hunger);
        this.checkCrying();
    }

    increaseSleepiness() {
        if (!this.isAlive) return;
        this.sleepiness = Math.min(100, this.sleepiness + 10);
        this.updateBar("sleepinesslevel", this.sleepiness);
        this.checkCrying();
    }

    increaseBoredom() {
        if (!this.isAlive) return;
        this.boredom = Math.min(100, this.boredom + 10);
        this.updateBar("boredomlevel", this.boredom);
        this.checkCrying();
    }

    die() {
        if (!this.isAlive) return;
        this.isAlive = false;
        // Clear all main intervals
        this.intervalIds.forEach(clearInterval);
        // Clear the animation interval
        if (this.animateIntervalId) clearInterval(this.animateIntervalId);

        // Game Over visuals
        const pic = document.getElementById('greeting');
        pic.src = "pic/youdied.png"; // Your skull image
        document.body.style.backgroundColor = "maroon";
        document.getElementById('audio2').play();

        // Hide all bars, buttons, and other elements
        document.querySelector('.hungerbar').style.display = "none";
        document.querySelector('.sleepinessbar').style.display = "none";
        document.querySelector('.boredombar').style.display = "none";
        document.querySelector('.hungerbarname').style.display = "none";
        document.querySelector('.sleepinessbarname').style.display = "none";
        document.querySelector('.boredombarname').style.display = "none";
        document.querySelector('.sleep').style.display = "none";
        document.querySelector('.eat').style.display = "none";
        document.querySelector('.play').style.display = "none";
        document.querySelector('.ageclass').style.display = "none";
        document.querySelector('.nameclass').style.display = "none";

        // Show Game Over message
        document.querySelector('.babyDie').style.display = "block";
        document.querySelector('.bye').style.display = "block";
    }

    animate() {
        const pic = document.getElementById('greeting');
        // Store the ID so we can stop it on death
        this.animateIntervalId = setInterval(() => {
            if (!this.isAlive) return;
            const horizontal = Math.floor(Math.random() * 15);
            const vertical = Math.floor(Math.random() * 25);
            pic.style.transform = `translate(${horizontal}px, ${vertical}px)`;
        }, 500);
    }
}

// DOM elements
const button1 = document.querySelector('.start');
const button2 = document.querySelector('.htp');
const sleepButton = document.querySelector('.sleep');
const eatButton = document.querySelector('.eat');
const playButton = document.querySelector('.play');
const nameShow = document.querySelector('.nameclass');

let monster; // holds the current game instance

// START BUTTON
button1.addEventListener("click", (e) => {
    e.preventDefault();
    button1.remove();
    button2.remove();

    // Show UI elements
    document.querySelector('.hungerbar').style.display = "block";
    document.querySelector('.sleepinessbar').style.display = "block";
    document.querySelector('.boredombar').style.display = "block";
    document.querySelector('.hungerbarname').style.display = "block";
    document.querySelector('.sleepinessbarname').style.display = "block";
    document.querySelector('.boredombarname').style.display = "block";
    sleepButton.style.display = "inline";
    eatButton.style.display = "inline";
    playButton.style.display = "inline";
    document.querySelector('.ageclass').style.display = "block";

    // Get name and start
    let name = prompt("Name your little monster:", "Tamagotchi");
    if (!name) name = "Tamagotchi"; // fallback
    nameShow.innerHTML = `${name}'s World!`;
    nameShow.style.display = "block";

    monster = new Tamagotchi(name);
    monster.start();

    document.body.style.backgroundColor = "aliceblue";
});

// HOW TO PLAY BUTTON
button2.addEventListener("click", (e) => {
    e.preventDefault();
    alert("You are now the caretaker of a genuine Tamagotchi. Tamagotchi is a cyber creature who has travelled millions of miles from its home planet to learn what life is like on earth.");
    alert("All you need to do is look after your baby, feed, put to sleep, make happy. If you forget any of them, you can kill your baby. Don't forget, your little monster needs you!");
});

// ACTION BUTTONS
sleepButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (monster && monster.isAlive) {
        monster.increaseSleepiness();
        document.getElementById('greeting').src = "pic/sleep.png";
        document.body.style.backgroundColor = "gray";
        setTimeout(() => document.body.style.backgroundColor = "aliceblue", 2000);
    }
});

eatButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (monster && monster.isAlive) {
        monster.increaseHunger();
        document.getElementById('greeting').src = "pic/eat.png";
        document.body.style.backgroundColor = "aliceblue";
        setTimeout(() => document.body.style.backgroundColor = "aliceblue", 2000);
    }
});

playButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (monster && monster.isAlive) {
        monster.increaseBoredom();
        document.getElementById('greeting').src = "pic/play.png";
        document.body.style.backgroundColor = "aliceblue";
        setTimeout(() => document.body.style.backgroundColor = "aliceblue", 2000);
    }
});