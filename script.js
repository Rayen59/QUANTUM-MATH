const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const postsContainer = document.getElementById('postsContainer');
const displayLabel = document.getElementById('displayLabel');

// --- 1. CHARGEMENT INITIAL ---
let posts = JSON.parse(localStorage.getItem('quantum_db')) || [];
renderPosts();

if(localStorage.getItem('math-theme') === 'dark') document.body.setAttribute('data-theme', 'dark');
if(localStorage.getItem('math-user')) displayLabel.innerText = localStorage.getItem('math-user');

// --- 2. FONCTIONS UTILISATEUR ---
function updateName() {
    const val = document.getElementById('usernameInput').value;
    if(val) {
        displayLabel.innerText = val;
        localStorage.setItem('math-user', val);
        document.getElementById('usernameInput').value = '';
    }
}

document.getElementById('themeToggle').onclick = () => {
    const theme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('math-theme', theme);
};

// --- 3. RENDU LATEX LIVE ---
editor.addEventListener('input', () => {
    preview.innerHTML = editor.value.replace(/\n/g, '<br>');
    MathJax.typesetPromise([preview]);
});

// --- 4. PUBLICATION ---
document.getElementById('publishBtn').onclick = () => {
    const text = editor.value;
    if(!text) return;

    const img = document.querySelector('#imagePreview img') ? document.querySelector('#imagePreview img').src : null;
    
    const newPost = {
        author: displayLabel.innerText,
        content: text,
        image: img,
        time: new Date().toLocaleTimeString()
    };

    posts.unshift(newPost);
    localStorage.setItem('quantum_db', JSON.stringify(posts));
    
    editor.value = '';
    document.getElementById('imagePreview').innerHTML = '';
    renderPosts();
};

function renderPosts() {
    postsContainer.innerHTML = posts.map((p, index) => `
        <div class="post-card">
            <div class="post-header"><span>@${p.author}</span> <span>${p.time}</span></div>
            <div class="post-content">${p.content.replace(/\n/g, '<br>')}</div>
            ${p.image ? `<div class="post-image"><img src="${p.image}"></div>` : ''}
            <span class="reply-link" onclick="reply('${p.author}')">⮑ Reply to this theorem</span>
        </div>
    `).join('');
    MathJax.typesetPromise([postsContainer]);
}

function reply(name) {
    editor.value = `@${name} Regarding your proof: \n` + editor.value;
    editor.focus();
}

// Gestion Image Preview
document.getElementById('imageInput').onchange = function(e) {
    const reader = new FileReader();
    reader.onload = (ev) => document.getElementById('imagePreview').innerHTML = `<img src="${ev.target.result}" style="width:100px;margin-top:10px;border-radius:5px;">`;
    reader.readAsDataURL(e.target.files[0]);
};

