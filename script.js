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
        <div class="contact-card" data-id="${c.id}">
            <div class="contact-info">
                <h3>${c.name}</h3>
                <p><i class="fas fa-phone"></i> ${c.phone} 
                   ${c.email ? `<i class="fas fa-envelope"></i> ${c.email}` : ''}
                </p>
            </div>
            <div class="contact-actions">
                <a href="tel:${c.phone}" class="action-btn call" title="Call">
                    <i class="fas fa-phone"></i>
                </a>
                <a href="sms:${c.phone}?body=Hi!" class="action-btn message" title="Message">
                    <i class="fas fa-sms"></i>
                </a>
                <button onclick="toggleFavourite(${c.id})" class="action-btn ${c.favourite ? 'fav-active' : ''}" title="Favourite">
                    ${c.favourite ? '💖' : '⭐'}
                </button>
                <button onclick="addMissed(${c.id})" class="action-btn missed" title="Missed Call">
                    <i class="fas fa-phone-slash"></i>
                </button>
                <button onclick="deleteContact(${c.id})" class="action-btn delete" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
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
// Sample contacts data (will use localStorage to save)
let contact = JSON.parse(localStorage.getItem('contacts')) || [
    {id:1, name:'Aaron', phone:'+91 9000000000', email:'aaron@email.com', group:'office'},
    {id:2, name:'Ayin', phone:'+91 9001111111', email:'ayin@email.com', group:'family'},
    {id:3, name:'Alexa', phone:'+91 9002222222', email:'alexa@email.com', group:'office'},
    {id:4, name:'Aitha', phone:'+91 9003333333', email:'aitha@email.com', group:'family'},
    {id:5, name:'Burnard', phone:'+91 9004444444', email:'burnard@email.com', group:'friends'},
];

let selectedContact = null;
let currentFilter = 'all';

// Save to localStorage
function saveContacts() {
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

// Display contacts list
function displayContacts(list = contacts) {
    const contactsList = document.getElementById('contactsList');
    contactsList.innerHTML = '';
    
    list.forEach(contact => {
        const div = document.createElement('div');
        div.className = 'contact-item';
        div.innerHTML = `
            <div class="avatar">${contact.name[0]}</div>
            <div class="contact-info">
                <div class="contact-item-name">${contact.name}</div>
                <div class="contact-item-phone">${contact.phone}</div>
            </div>
            <div class="contact-options">
                <button onclick="showContactDetails(${contact.id})" class="view-btn">View</button>
                <button onclick="deleteContact(${contact.id})" class="del-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;
        contactsList.appendChild(div);
    });
}

// Filter contacts
function filterContacts(type) {
    currentFilter = type;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if(type === 'all') {
        displayContacts(contacts);
    } else {
        displayContacts(contacts.filter(c => c.group === type));
    }
}

// Search contacts
function searchContacts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = contacts.filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.phone.includes(query)
    );
    displayContacts(filtered);
}

// Show contact details
function showContactDetails(id) {
    selectedContact = contacts.find(c => c.id === id);
    if(!selectedContact) return;
    
    document.getElementById('contactsList').parentElement.style.display = 'none';
    document.getElementById('detailsView').style.display = 'flex';
    
    document.getElementById('detailAvatar').textContent = selectedContact.name[0];
    document.getElementById('detailName').textContent = selectedContact.name;
    document.getElementById('detailNumber').textContent = selectedContact.phone;
    document.getElementById('detailMobile').textContent = selectedContact.group || 'Personal';
}

// Back to list
function backToList() {
    document.getElementById('detailsView').style.display = 'none';
    document.getElementById('contactsList').parentElement.style.display = 'block';
}

// Add contact form
function openAddForm() {
    document.getElementById('addModal').style.display = 'flex';
}

function closeAddForm() {
    document.getElementById('addModal').style.display = 'none';
    document.getElementById('contactForm').reset();
}

function addContact(event) {
    event.preventDefault();
    const newContact = {
        id: contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1,
        name: document.getElementById('nameInput').value,
        phone: document.getElementById('phoneInput').value,
        email: document.getElementById('emailInput').value,
        group: document.getElementById('groupInput').value || 'friends'
    };
    
    contacts.push(newContact);
    saveContacts();
    displayContacts(contacts);
    closeAddForm();
}

// Delete contact
function deleteContact(id = null) {
    const contactId = id || selectedContact.id;
    if(confirm('Are you sure?')) {
        contacts = contacts.filter(c => c.id !== contactId);
        saveContacts();
        displayContacts(contacts);
        backToList();
    }
}

// Initialize
displayContacts();