// Config page script
const DEFAULT_CONFIG = {
    appleScore: 1,
    bananaScore: 1,
    carrotScore: 1,
    eggScore: 1,
    milkScore: 3,
    negativeScore: -1,
    winScore: 20,
    gameTimer: 30,
    initialSpawnDelay: 1200,
    minSpawnDelay: 600,
    initialGravity: 300,
    maxGravity: 900
};

// Load configuration from localStorage or use defaults
function loadConfig() {
    const savedConfig = localStorage.getItem('gameConfig');
    if (savedConfig) {
        return JSON.parse(savedConfig);
    }
    return { ...DEFAULT_CONFIG };
}

// Save configuration to localStorage
function saveConfig(config) {
    localStorage.setItem('gameConfig', JSON.stringify(config));
}

// Get configuration value
function getConfigValue(key) {
    const config = loadConfig();
    return config[key] !== undefined ? config[key] : DEFAULT_CONFIG[key];
}

// Populate form with current configuration
function populateForm() {
    const config = loadConfig();
    
    document.getElementById('appleScore').value = config.appleScore;
    document.getElementById('bananaScore').value = config.bananaScore;
    document.getElementById('carrotScore').value = config.carrotScore;
    document.getElementById('eggScore').value = config.eggScore;
    document.getElementById('milkScore').value = config.milkScore;
    document.getElementById('negativeScore').value = config.negativeScore;
    document.getElementById('winScore').value = config.winScore;
    document.getElementById('gameTimer').value = config.gameTimer;
    document.getElementById('initialSpawnDelay').value = config.initialSpawnDelay;
    document.getElementById('minSpawnDelay').value = config.minSpawnDelay;
    document.getElementById('initialGravity').value = config.initialGravity;
    document.getElementById('maxGravity').value = config.maxGravity;
}

// Show message
function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    messageEl.style.display = 'block';
    
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 3000);
}

// Initialize page
window.onload = function() {
    populateForm();
    
    // Handle form submission
    document.getElementById('configForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const config = {
            appleScore: parseInt(document.getElementById('appleScore').value),
            bananaScore: parseInt(document.getElementById('bananaScore').value),
            carrotScore: parseInt(document.getElementById('carrotScore').value),
            eggScore: parseInt(document.getElementById('eggScore').value),
            milkScore: parseInt(document.getElementById('milkScore').value),
            negativeScore: parseInt(document.getElementById('negativeScore').value),
            winScore: parseInt(document.getElementById('winScore').value),
            gameTimer: parseInt(document.getElementById('gameTimer').value),
            initialSpawnDelay: parseInt(document.getElementById('initialSpawnDelay').value),
            minSpawnDelay: parseInt(document.getElementById('minSpawnDelay').value),
            initialGravity: parseInt(document.getElementById('initialGravity').value),
            maxGravity: parseInt(document.getElementById('maxGravity').value)
        };
        
        saveConfig(config);
        showMessage('Configuration saved successfully!', 'success');
    });
    
    // Handle reset button
    document.getElementById('resetButton').addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all settings to default values?')) {
            saveConfig(DEFAULT_CONFIG);
            populateForm();
            showMessage('Configuration reset to defaults!', 'success');
        }
    });
    
    // Handle back button
    document.getElementById('backButton').addEventListener('click', function() {
        window.location.href = '../index.html';
    });
};
