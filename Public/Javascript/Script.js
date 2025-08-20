// État du jeu
const gameState = {
    oxygen: 100,
    fuel: 100,
    energy: 100,
    gameOver: false,
    eventsCount: 0,
    gamesPlayed: 0,
    maxScore: 0,
    unlockedItems: []
};

// Événements possibles
const events = [
    {
        text: "Un signal étrange provient d'une planète proche. Que faire ?",
        choices: [
            { text: "Explorer la planète", effects: { oxygen: -10, fuel: -5, energy: -5 } },
            { text: "Ignorer le signal", effects: { energy: -2 } }
        ]
    },
    {
        text: "Une tempête solaire approche. Comment réagir ?",
        choices: [
            { text: "Protéger le vaisseau", effects: { energy: -15, fuel: -5 } },
            { text: "Accélérer pour l'éviter", effects: { fuel: -20, energy: -10 } }
        ]
    },
    {
        text: "Les réserves d'oxygène sont faibles. Que faire ?",
        choices: [
            { text: "Rationner l'oxygène", effects: { oxygen: -5, energy: -10 } },
            { text: "Utiliser le recyclage", effects: { energy: -15, oxygen: +10 } }
        ]
    },
    {
        text: "Un vaisseau de secours demande de l'aide. Répondre ?",
        choices: [
            { text: "Aider le vaisseau", effects: { fuel: -10, energy: -5 } },
            { text: "Ignorer l'appel", effects: { energy: -2 } }
        ]
    },
    {
        text: "Le système de navigation est endommagé. Comment réparer ?",
        choices: [
            { text: "Réparation d'urgence", effects: { energy: -20, fuel: -5 } },
            { text: "Attendre un technicien", effects: { energy: -5 } }
        ]
    }
];

// Conseils de l'ingénieur
const advices = [
    "Capitaine, je recommande d'économiser le carburant.",
    "Les réserves d'oxygène sont critiques, capitaine.",
    "Je suggère de réparer les systèmes endommagés.",
    "Nous devrions explorer cette planète, capitaine.",
    "Attention aux tempêtes solaires, capitaine."
];

// Éléments DOM
const gameContainer = document.getElementById('game-container');
const mainMenu = document.getElementById('main-menu');
const startButton = document.getElementById('start-game');
const eventText = document.getElementById('event-text');
const adviceText = document.getElementById('advice-text');
const choice1Button = document.getElementById('choice1');
const choice2Button = document.getElementById('choice2');
const oxygenValue = document.getElementById('oxygen-value');
const fuelValue = document.getElementById('fuel-value');
const energyValue = document.getElementById('energy-value');
const oxygenBar = document.getElementById('oxygen-bar');
const fuelBar = document.getElementById('fuel-bar');
const energyBar = document.getElementById('energy-bar');
const gamesPlayedElement = document.getElementById('games-played');
const maxScoreElement = document.getElementById('max-score');
const eventsCountElement = document.getElementById('events-count');

// Initialisation du jeu
function initGame() {
    gameState.oxygen = 100;
    gameState.fuel = 100;
    gameState.energy = 100;
    gameState.gameOver = false;
    gameState.eventsCount = 0;
    
    updateResourceDisplays();
    generateEvent();
    updateStats();
    
    gameContainer.classList.remove('hidden');
    mainMenu.classList.add('hidden');
}

// Mise à jour des affichages de ressources
function updateResourceDisplays() {
    oxygenValue.textContent = Math.max(0, gameState.oxygen) + '%';
    fuelValue.textContent = Math.max(0, gameState.fuel) + '%';
    energyValue.textContent = Math.max(0, gameState.energy) + '%';
    
    oxygenBar.style.width = Math.max(0, gameState.oxygen) + '%';
    fuelBar.style.width = Math.max(0, gameState.fuel) + '%';
    energyBar.style.width = Math.max(0, gameState.energy) + '%';
    
    // Couleurs selon niveau
    if (gameState.oxygen < 30) {
        oxygenBar.style.backgroundColor = '#ff4d4d';
    } else if (gameState.oxygen < 60) {
        oxygenBar.style.backgroundColor = '#ffcc00';
    } else {
        oxygenBar.style.backgroundColor = '#64ffda';
    }
    
    if (gameState.fuel < 30) {
        fuelBar.style.backgroundColor = '#ff4d4d';
    } else if (gameState.fuel < 60) {
        fuelBar.style.backgroundColor = '#ffcc00';
    } else {
        fuelBar.style.backgroundColor = '#00ff9d';
    }
    
    if (gameState.energy < 30) {
        energyBar.style.backgroundColor = '#ff4d4d';
    } else if (gameState.energy < 60) {
        energyBar.style.backgroundColor = '#ffcc00';
    } else {
        energyBar.style.backgroundColor = '#ff4d4d';
    }
}

// Générer un événement aléatoire
function generateEvent() {
    if (gameState.gameOver) return;
    
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    eventText.textContent = randomEvent.text;
    
    // Mise à jour du conseil
    adviceText.textContent = advices[Math.floor(Math.random() * advices.length)];
    
    // Mise à jour des boutons de choix
    choice1Button.textContent = randomEvent.choices[0].text;
    choice2Button.textContent = randomEvent.choices[1].text;
    
    // Ajout des listeners pour les choix
    choice1Button.onclick = () => applyChoice(randomEvent.choices[0]);
    choice2Button.onclick = () => applyChoice(randomEvent.choices[1]);
    
    gameState.eventsCount++;
    updateStats();
}

// Appliquer les effets d'un choix
function applyChoice(choice) {
    gameState.oxygen += choice.effects.oxygen || 0;
    gameState.fuel += choice.effects.fuel || 0;
    gameState.energy += choice.effects.energy || 0;
    
    // Limiter les ressources entre 0 et 100
    gameState.oxygen = Math.min(100, Math.max(0, gameState.oxygen));
    gameState.fuel = Math.min(100, Math.max(0, gameState.fuel));
    gameState.energy = Math.min(100, Math.max(0, gameState.energy));
    
    updateResourceDisplays();
    
    // Vérifier si le jeu continue
    if (gameState.oxygen <= 0 || gameState.fuel <= 0 || gameState.energy <= 0) {
        gameOver();
    } else {
        // Générer un nouvel événement
        setTimeout(generateEvent, 500);
    }
}

// Fin du jeu
function gameOver() {
    gameState.gameOver = true;
    gameState.gamesPlayed++;
    
    if (gameState.eventsCount > gameState.maxScore) {
        gameState.maxScore = gameState.eventsCount;
    }
    
    updateStats();
    
    // Afficher le menu principal après un délai
    setTimeout(() => {
        gameContainer.classList.add('hidden');
        mainMenu.classList.remove('hidden');
    }, 2000);
}

// Mise à jour des statistiques
function updateStats() {
    gamesPlayedElement.textContent = gameState.gamesPlayed;
    maxScoreElement.textContent = gameState.maxScore;
    eventsCountElement.textContent = gameState.eventsCount;
}

// Initialisation des listeners
startButton.addEventListener('click', initGame);

// Démarrer le jeu
document.addEventListener('DOMContentLoaded', () => {
    mainMenu.classList.remove('hidden');
});