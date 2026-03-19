// --- INITIALISATION ---
const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const userNameDisplay = document.getElementById('userName');
const nameInput = document.getElementById('nameInput');
const saveNameBtn = document.getElementById('saveName');
const postContent = document.getElementById('postContent');
const mathPreview = document.getElementById('mathPreview');
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');

// --- GESTION DU THÈME (DARK MODE) ---
// Charger le thème sauvegardé
if (localStorage.getItem('theme') === 'dark') {
    body.setAttribute('data-theme', 'dark');
}

themeToggle.addEventListener('click', () => {
    if (body.hasAttribute('data-theme')) {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
});

// --- GESTION DE L'UTILISATEUR (PSEUDO) ---
// Charger le nom sauvegardé
const savedName = localStorage.getItem('quantum_username');
if (savedName) userNameDisplay.innerText = savedName;

saveNameBtn.addEventListener('click', () => {
    const newName = nameInput.value;
    if (newName) {
        localStorage.setItem('quantum_username', newName);
        userNameDisplay.innerText = newName;
        nameInput.value = '';
    }
});

// --- GESTION DU LIVE PREVIEW (LATEX) ---
postContent.addEventListener('input', () => {
    // 1. Mettre le texte dans la zone de preview
    const text = postContent.value;
    mathPreview.innerText = text;
    
    // 2. Demander à MathJax de transformer le texte en rendu mathématique
    MathJax.typesetPromise([mathPreview]).catch((err) => console.log('MathJax error:', err));
});

// --- GESTION DE L'IMAGE (PREVIEW LOCALE) ---
imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
            imagePreview.innerHTML = `<img src="${readerEvent.target.result}" alt="Uploaded image preview">`;
        };
        reader.readAsDataURL(file);
    }
});

