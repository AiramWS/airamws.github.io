function toggleUserSettings(clickedButton, showSettings) {

    const panel = clickedButton.closest('.user-panel');
    if (!panel) return;

    const userNameElement = panel.querySelector('h1');
    const colorPicker = panel.querySelector('.color-picker');
    
    panel.querySelector('.user-settings').style.display = 
        showSettings ? 'none' : 'block';
    panel.querySelector('.save-settings').style.display = 
        showSettings ? 'block' : 'none';
    panel.querySelectorAll('.picture-changer').forEach(arrow => {
        arrow.style.display = showSettings ? 'block' : 'none';
    });

    if (showSettings) {
        enableEditing(userNameElement);
        expandColorPicker(colorPicker);
    } else {
        disableEditing(userNameElement);
        collapseColorPicker(colorPicker);
    }
}

function expandColorPicker(picker) {
    picker.classList.add('visible');
}


function collapseColorPicker(picker) {
    picker.classList.remove('visible');
}

function enableEditing(userNameElement) {
    userNameElement.contentEditable = true;
    userNameElement.focus(); 

    userNameElement.addEventListener('keydown', handleKeyDown);
    userNameElement.addEventListener('input', enforceMaxLength);

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(userNameElement);
    selection.removeAllRanges();
    selection.addRange(range);
}

function disableEditing(userNameElement) {
    userNameElement.contentEditable = false; 

    userNameElement.removeEventListener('keydown', handleKeyDown);
    userNameElement.removeEventListener('input', enforceMaxLength);
}

function handleKeyDown(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        this.blur();
    }
}

function enforceMaxLength() {
    if (this.textContent.length > 8) {
        this.textContent = this.textContent.substring(0, 8);
    }

    if (/\s/.test(this.textContent)) {
        this.textContent = this.textContent.replace(/\s+/g, '');
    }
}

function openUserSettings(clickedButton) {
    toggleUserSettings(clickedButton, true);
}

function closeUserSettings(clickedButton) {
    toggleUserSettings(clickedButton, false);
}



