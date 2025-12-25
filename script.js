// ===== DATA =====
let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
let missedCalls = JSON.parse(localStorage.getItem('missedCalls')) || [];
let currentFilter = 'all';

// ===== SLIDES =====
function showSlide(slideId, btn) {
    document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'));

    const slide = document.getElementById(slideId);
    if (slide) slide.classList.add('active');

    if (btn) btn.classList.add('active');

    if (slideId === 'all') displayContacts();
    if (slideId === 'fav') displayContacts('fav');
    if (slideId === 'missed') displayMissed();
}

// ===== ADD CONTACT =====
function addContact(e) {
    e.preventDefault();

    const name = document.getElementById('nameInput').value.trim();
    const phone = document.getElementById('phoneInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const group = document.getElementById('groupInput').value || 'friends';
    const note = document.getElementById('noteInput').value.trim();
    
    if (!name || !phone) {
        alert('Name and phone are required');
        return;
    }
    if (phone.length !== 10) {
        alert('Phone must be 10 digits');
        return;
    }

    const contact = {
        id: Date.now(),
        name,
        phone,
        email,
        group,
        favourite: false,
        note
    };

    contacts.push(contact);
    saveContacts();
    e.target.reset();
    alert('Contact saved');
    showSlide('all');
    displayContacts();
}

// ===== SAVE =====
function saveContacts() {
    localStorage.setItem('contacts', JSON.stringify(contacts));
}
function saveMissed() {
    localStorage.setItem('missedCalls', JSON.stringify(missedCalls));
}

// ===== DISPLAY CONTACTS =====
function displayContacts(filter = 'all') {
    currentFilter = filter;

    const listEl = document.getElementById('contactsList');
    const favEl = document.getElementById('favList');
    if (!listEl || !favEl) return;

    let list = [...contacts];

    if (filter === 'office' || filter === 'family' || filter === 'friends') {
        list = list.filter(c => c.group === filter);
    }

    list.sort((a, b) => a.name.localeCompare(b.name));

    listEl.innerHTML = '';
    favEl.innerHTML = '';

    list.forEach(c => {
        const html = createContactHTML(c);
        listEl.appendChild(html);

        if (c.favourite) {
            favEl.appendChild(createContactHTML(c));
        }
    });
}

function createContactHTML(c) {
    const div = document.createElement('div');
    div.className = 'contact-item';
    div.innerHTML = `
    <div class="avatar">${c.name[0]}</div>
    <div class="contact-info">
        <div class="contact-item-name">${c.name}</div>
        <div class="contact-item-phone">${c.phone}</div>
        <div class="contact-item-phone">${c.note ? c.note : ''}</div>
    </div>
    <div class="contact-actions">
        ...
    </div>
    `;
    return div;
}

// ===== FILTER TABS =====
function filterContacts(type, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    displayContacts(type);
}

// ===== SEARCH =====
function searchContacts() {
    const input = document.getElementById('searchInput');
    const q = input.value.toLowerCase();

    let list = [...contacts];
    if (currentFilter === 'office' || currentFilter === 'family' || currentFilter === 'friends') {
        list = list.filter(c => c.group === currentFilter);
    }

    const filtered = list.filter(c =>
        c.name.toLowerCase().includes(q) || c.phone.includes(q)
    );

    const listEl = document.getElementById('contactsList');
    listEl.innerHTML = '';
    filtered.sort((a, b) => a.name.localeCompare(b.name));
    filtered.forEach(c => listEl.appendChild(createContactHTML(c)));
}

// ===== FAVOURITE =====
function toggleFavourite(id) {
    const c = contacts.find(ct => ct.id === id);
    if (!c) return;
    c.favourite = !c.favourite;
    saveContacts();
    displayContacts(currentFilter);
}

// ===== DELETE CONTACT =====
function deleteContact(id) {
    if (!confirm('Delete this contact?')) return;
    contacts = contacts.filter(c => c.id !== id);
    saveContacts();
    displayContacts(currentFilter);
}

// ===== MISSED CALLS =====
function addMissed(id) {
    const c = contacts.find(ct => ct.id === id);
    if (!c) return;
    missedCalls.unshift({
        id: Date.now(),
        name: c.name,
        phone: c.phone,
        time: new Date().toISOString()
    });
    saveMissed();
    alert('Added to missed calls');
}

function displayMissed() {
    const list = document.getElementById('missedList');
    if (!list) return;

    const sorted = [...missedCalls].sort(
        (a, b) => new Date(b.time) - new Date(a.time)
    );

    list.innerHTML = sorted.map(c => `
        <div class="contact-card">
            <div>${c.name} (${c.phone})</div>
            <small>${new Date(c.time).toLocaleString()}</small>
        </div>
    `).join('');
}

function clearMissed() {
    if (!confirm('Clear all missed calls?')) return;
    missedCalls = [];
    saveMissed();
    displayMissed();
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', addContact);

    const search = document.getElementById('searchInput');
    search.addEventListener('input', searchContacts);

    displayContacts();
    displayMissed();
    showSlide('home');   // start on home slide
});