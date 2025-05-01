const availableIcons = [
    'fa-skull',
    'fa-cat',
    'fa-dragon',
    'fa-ghost',
    'fa-hat-wizard',
    'fa-paw',
    'fa-eye',
    'fa-robot',
    'fa-virus',
    'fa-otter',
    'fa-spaghetti-monster-flying'
];

let currentIconIndexLeft = 0;
let currentIconIndexRight = 0;

function setupIconChanger() {
    document.querySelectorAll('.picture-changer').forEach(button => {
        button.addEventListener('click', function(e) {
            const panel = this.closest('.user-panel');
            if (!panel) return;

            const isLeftPanel = panel.id === 'left-panel';
            const direction = this.id === 'left' ? -1 : 1;

            if (isLeftPanel) {
                currentIconIndexLeft = cycleIndex(currentIconIndexLeft, direction, availableIcons.length);
                updateIcon(panel, availableIcons[currentIconIndexLeft]);
            } else {
                currentIconIndexRight = cycleIndex(currentIconIndexRight, direction, availableIcons.length);
                updateIcon(panel, availableIcons[currentIconIndexRight]);
            }
        });
    });
}

function cycleIndex(current, direction, max) {
    const newIndex = current + direction;
    if (newIndex >= max) return 0;
    if (newIndex < 0) return max - 1;
    return newIndex;
}

function updateIcon(panel, newIconClass) {
    const icon = panel.querySelector('.user-icon');
    if (!icon) return;

    icon.className = 'user-icon';
    icon.classList.add(newIconClass, 'fa-solid');
}

document.addEventListener('DOMContentLoaded', function() {
    setupIconChanger();

    document.querySelectorAll('.user-panel').forEach(panel => {
        const isLeft = panel.id === 'left-panel';
        updateIcon(panel, availableIcons[isLeft ? currentIconIndexLeft : currentIconIndexRight]);
    });
});