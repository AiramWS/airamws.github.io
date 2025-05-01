let selectedColorLeft = '#ff0000'; 
let selectedColorRight = '#0000ff';

function changeColor(panel, selectedColor) {
    const userIcon = panel.querySelector('.user-icon');
    if (!userIcon) return;

    // Update the selected color for the current panel
    if (panel.id === 'left-panel') {
        selectedColorLeft = selectedColor;
        window.gameState.player1Color = selectedColor;
    } else {
        selectedColorRight = selectedColor;
        window.gameState.player2Color = selectedColor;
    }

    // Update UI (color, styles)
    userIcon.style.color = selectedColor;
    panel.style.backgroundColor = getColorTone(selectedColor);
    panel.style.boxShadow = `0px 0px 20px ${getShadowColor(selectedColor)}`;
    panel.style.borderColor = getBorderColor(selectedColor);
    panel.style.opacity = 0.8;

    // Update color pickers to reflect blocked colors
    updateColorPickers();
}

// Update both panels' color pickers to block the other panel's color
function updateColorPickers() {
    const allColorDivs = document.querySelectorAll('.color-picker .color');

    allColorDivs.forEach(colorDiv => {
        const colorValue = colorDiv.getAttribute('data-color');

        // Disable colors selected by the opposite panel
        const isBlockedLeft = colorValue === selectedColorRight;
        const isBlockedRight = colorValue === selectedColorLeft;

        // For left panel's picker, block right's color
        if (colorDiv.closest('#left-panel')) {
            colorDiv.classList.toggle('disabled', isBlockedLeft);
        }
        // For right panel's picker, block left's color
        else if (colorDiv.closest('#right-panel')) {
            colorDiv.classList.toggle('disabled', isBlockedRight);
        }
    });
}

// Block selected color in the color picker
function blockColorInPicker(panel, color, panelId) {
    const colorDivs = document.querySelectorAll('.color-picker .color');
    colorDivs.forEach(colorDiv => {
        const colorValue = colorDiv.getAttribute('data-color');

        // Block colors for left or right panel depending on the passed panelId
        if (panelId === 'left' && blockedColorsLeftPanel.includes(colorValue)) {
            colorDiv.classList.add('disabled');
        } else if (panelId === 'right' && blockedColorsRightPanel.includes(colorValue)) {
            colorDiv.classList.add('disabled');
        } else {
            colorDiv.classList.remove('disabled');
        }
    });
}

// Set initial colors of the panels
function setInitialColors() {
    const leftPanel = document.getElementById('left-panel');
    const leftColor = '#ff0000'; // Set left panel color
    changeColor(leftPanel, leftColor);
    
    const rightPanel = document.getElementById('right-panel');
    const rightColor = '#0000ff'; // Set right panel color
    changeColor(rightPanel, rightColor);
}

// Set up the color picker interaction
function setupColorPicker() {
    const colorDivs = document.querySelectorAll('.color-picker .color');
    
    colorDivs.forEach(colorDiv => {
        colorDiv.addEventListener('click', function() {
            const selectedColor = this.getAttribute('data-color'); 

            const panel = this.closest('.user-panel');
            if (panel) {
                changeColor(panel, selectedColor);  
            }
        });
    });
}

// Get the color tone based on the selected hex color
function getColorTone(hex) {
    let r = parseInt(hex.substr(1, 2), 16);
    let g = parseInt(hex.substr(3, 2), 16);
    let b = parseInt(hex.substr(5, 2), 16);

    r = Math.floor(r * 0.5);
    g = Math.floor(g * 0.5);
    b = Math.floor(b * 0.5);

    return `rgb(${r}, ${g}, ${b})`;
}

// Get the shadow color based on the selected hex color
function getShadowColor(hex) {
    let r = parseInt(hex.substr(1, 2), 16);
    let g = parseInt(hex.substr(3, 2), 16);
    let b = parseInt(hex.substr(5, 2), 16);

    r = Math.floor(r * 0.7);
    g = Math.floor(g * 0.7);
    b = Math.floor(b * 0.7);

    return `rgb(${r}, ${g}, ${b})`;
}

// Get the border color based on the selected hex color
function getBorderColor(hex) {
    let r = parseInt(hex.substr(1, 2), 16);
    let g = parseInt(hex.substr(3, 2), 16);
    let b = parseInt(hex.substr(5, 2), 16);

    r = Math.floor(r * 0.8);
    g = Math.floor(g * 0.8);
    b = Math.floor(b * 0.8);

    return `rgb(${r}, ${g}, ${b})`;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    setInitialColors();  // Set the initial colors of the panels
    setupColorPicker();  // Set up the color picker interaction
});
