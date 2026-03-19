const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const postsContainer = document.getElementById('postsContainer');
const displayLabel = document.getElementById('displayLabel');
const imagePreview = document.getElementById('imagePreview');

// 1. Initial Load from LocalStorage
let posts = JSON.parse(localStorage.getItem('quantum_db')) || [];
renderPosts();

if(localStorage.getItem('math-theme') === 'dark') document.body.setAttribute('data-theme', 'dark');
if(localStorage.getItem('math-user')) displayLabel.innerText = localStorage.getItem('math-user');

// 2. User Settings
function updateName() {
    const val = document.getElementById('usernameInput').value;
    if(val.trim() !== "") {
        displayLabel.innerText = val;
        localStorage.setItem('math-user', val);
        document.getElementById('usernameInput').value = '';
    }
}

function toggleTheme() {
    const theme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('math-theme', theme);
}

// 3. Live LaTeX Rendering
editor.addEventListener('input', () => {
    preview.innerHTML = editor.value.replace(/\n/g, '<br>');
    if (window.MathJax) {
        MathJax.typesetPromise([preview]);
    }
});

// 4. Image Handling
document.getElementById('imageInput').onchange = function(e) {
    const reader = new FileReader();
    reader.onload = (ev) => {
        imagePreview.innerHTML = `<img src="${ev.target.result}" style="width:150px; margin-top:10px;">`;
    };
    reader.readAsDataURL(e.target.files[0]);
};

// 5. Publish Logic
function publishPost() {
    const text = editor.value;
    if(!text.trim()) {
        alert("Please write something first!");
        return;
    }

    const img = imagePreview.querySelector('img') ? imagePreview.querySelector('img').src : null;
    
    const newEntry = {
        author: displayLabel.innerText,
        content: text,
        image: img,
        time: new Date().toLocaleTimeString()
    };

    posts.unshift(newEntry);
    localStorage.setItem('quantum_db', JSON.stringify(posts));
    
    // Clear Editor
    editor.value = '';
    imagePreview.innerHTML = '';
    preview.innerHTML = 'Preview...';
    
    renderPosts();
}

// 6. Display Logic
function renderPosts() {
    postsContainer.innerHTML = posts.map((p) => `
        <div class="post-card">
            <div class="post-header"><span>@${p.author}</span> <span>${p.time}</span></div>
            <div class="post-content">${p.content.replace(/\n/g, '<br>')}</div>
            ${p.image ? `<div class="post-image"><img src="${p.image}"></div>` : ''}
            <span class="reply-link" onclick="reply('${p.author}')">⮑ Reply to this theorem</span>
        </div>
    `).join('');

    if (window.MathJax) {
        MathJax.typesetPromise([postsContainer]);
    }
}

function reply(name) {
    editor.value = `@${name} Regarding your proof: \n` + editor.value;
    editor.focus();
}

