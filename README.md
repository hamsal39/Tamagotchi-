# AI Tamagotchi

A web-based virtual pet which utilizes a simple rule-based engine named "30% AI". This project demonstrates how to create a basic autonomous behavior using just JavaScript, HTML, and CSS.

## Features
- **Autonomous AI Engine**: Checks the status of the pet's needs (Hunger, Happiness, Energy) every 2 seconds and acts independently.
- **Interactive Gameplay**: Play with, feed, and put your pet to sleep to help it survive.
- **Dynamic Interface**: Status bars become more saturated (Green → Yellow → Red) depending on the severity of the need.
- **Animations**: Uses CSS transitions to bounce and shake the pet.
- **Game Over Screen**: The game will end once one of the stats goes down to zero, along with an option to start over.

## Technologies
- **HTML5**: Semantically organizes the device and controls.
- **CSS3**: Retro LCD design, flexbox layout, and keyframes animations.
- **JavaScript (ES6+)**: Game loop, state management, and decision tree.

## Project Structure
```text
ai-tamagotchi/
├── index.html      # Main HTML layout
├── style.css       # All styles and animations
├── script.js       # Game mechanics and AI engine
├── .gitignore      # Git ignore file
└── README.md       # Current file
```
