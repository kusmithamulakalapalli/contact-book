let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
let missedCalls = JSON.parse(localStorage.getItem('missedCalls')) || [];

// Show slide
function showSlide(slideId) {
    document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'));
    document.getElementById(slideId).classList.add('active');
    event.target.classList.add('active');
    if (slideId === 'all' || slideId === 'fav') displayContacts();
    if (slideId === 'missed') displayMissed();
}

// Add contact
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const favourite = document.getElementById('favourite').checked;
    
    if (phone.length !== 10) { alert('Phone must be 10 digits'); return; }
    
    const contact = { name, phone, email, favourite, id: Date.now() };
    contacts.push(contact);
    localStorage.setItem('contacts', JSON.stringify(contacts));
    alert('Contact saved!');
    this.reset();
    showSlide('all');
});

// Display contacts (alphabetical)
function displayContacts(filter = 'all') {
    const list = document.getElementById('contactsList');
    const favList = document.getElementById('favList');
    let filtered = contacts.sort((a, b) => a.name.localeCompare(b.name));
    
    if (filter === 'fav') filtered = filtered.filter(c => c.favourite);
    
    const search = document.getElementById('search')?.value.toLowerCase() || '';
    filtered = filtered.filter(c => c.name.toLowerCase().includes(search));
    
    const container = filter === 'fav' ? favList : list;
    container.innerHTML = filtered.map(c => `
        <div class="contact-card">
            <div class="contact-info">
                <h3>${c.name}</h3>
                <p>${c.phone} ${c.email ? `| ${c.email}` : ''}</p>
            </div>
            <div class="contact-actions">
                <a href="tel:${c.phone}" title="Call"><i class="fas fa-phone"></i></a>
                <button onclick="toggleFavourite(${c.id})" title="Favourite">${c.favourite ? '💖' : '⭐'}</button>
                <button onclick="addMissed(${c.id})" title="Missed Call"><i class="fas fa-phone-slash"></i></button>
                <button onclick="deleteContact(${c.id})" title="Delete">🗑️</button>
            </div>
        </div>
    `).join('');
}

// Search
document.getElementById('search')?.addEventListener('input', () => displayContacts());

// Toggle favourite
function toggleFavourite(id) {
    const contact = contacts.find(c => c.id === id);
    contact.favourite = !contact.favourite;
    localStorage.setItem('contacts', JSON.stringify(contacts));
    displayContacts();
}

// Delete contact
function deleteContact(id) {
    if (confirm('Delete this contact?')) {
        contacts = contacts.filter(c => c.id !== id);
        localStorage.setItem('contacts', JSON.stringify(contacts));
        displayContacts();
    }
}

// Missed calls
function displayMissed() {
    const list = document.getElementById('missedList');
    const sorted = missedCalls.sort((a, b) => new Date(b.time) - new Date(a.time));
    list.innerHTML = sorted.map(c => `
        <div class="contact-card">
            <div>${c.name} (${c.phone})</div>
            <small>${new Date(c.time).toLocaleString()}</small>
        </div>
    `).join('');
}

function addMissed(id) {
    const contact = contacts.find(c => c.id === id);
    missedCalls.unshift({ ...contact, time: new Date().toISOString() });
    localStorage.setItem('missedCalls', JSON.stringify(missedCalls));
    alert('Added to missed calls');
}

function clearMissed() {
    if (confirm('Clear all missed calls?')) {
        missedCalls = [];
        localStorage.setItem('missedCalls', JSON.stringify(missedCalls));
        displayMissed();
    }
}

// Init
showSlide('home');