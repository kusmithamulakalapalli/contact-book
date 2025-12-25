// ========================
// Data from localStorage
// ========================
let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
let missedCalls = JSON.parse(localStorage.getItem('missedCalls')) || [];

// current filter for All Contacts tab-buttons (all / office / family / friends)
let currentFilter = 'all';

// ========================
// Slide navigation
// ========================
function showSlide(slideId, btn) {
    // remove active class from all slides
    document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));

    // remove active from all navbar buttons
    document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'));

    // activate selected slide
    const slide = document.getElementById(slideId);
    if (slide) slide.classList.add('active');

    // highlight clicked button
    if (btn) {
        btn.classList.add('active');
    }

    // extra logic per slide
    if (slideId === 'all') displayContacts();
    if (slideId === 'missed') displayMissed();
}

// ========================
// Add new contact
// ========================
function addContact(e) {
    e.preventDefault();

    const name = document.getElementById('nameInput').value.trim();
    const phone = document.getElementById('phoneInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const group = document.getElementById('groupInput').value || 'friends';
    const favourite = false;

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
        favourite
    };

    contacts.push(contact);
    saveContacts();

    alert('Contact saved!');
    e.target.reset();
    closeAddForm();
    showSlide('all');
    displayContacts();
}

// ========================
// Save to localStorage
// ========================
function saveContacts() {
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

function saveMissed() {
    localStorage.setItem('missedCalls', JSON.stringify(missedCalls));
}

// ========================
// Display contacts (All Contacts slide)
// ========================
function displayContacts(filter = 'all') {
    const contactsList = document.getElementById('contactsList');
    const favList = document.getElementById('favList');

    if (!contactsList || !favList) return;

    let list = [...contacts];

    // group filter (office / family / friends)
    if (filter !== 'all') {
        list = list.filter(c => c.group === filter);
    }

    // alphabetical
    list.sort((a, b) => a.name.localeCompare(b.name));

    contactsList.innerHTML = '';
    favList.innerHTML = '';

    list.forEach(c => {
        const div = document.createElement('div');
        div.className = 'contact-item';
        div.innerHTML = `
            <div class="avatar">${c.name[0]}</div>
            <div class="contact-info">
                <div class="contact-item-name">${c.name}</div>
                <div class="contact-item-phone">${c.phone}</div>
            </div>
            <div class="contact-actions">
                <button onclick="showContactDetails(${c.id})" class="action-btn"><i class="fas fa-eye"></i></button>
                <button onclick="toggleFavourite(${c.id})" class="action-btn" title="Favourite">
                    ${c.favourite ? '★' : '☆'}
                </button>
                <button onclick="addMissed(${c.id})" class="action-btn" title="Add missed">
                    <i class="fas fa-phone-slash"></i>
                </button>
                <button onclick="deleteContact(${c.id})" class="action-btn" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        contactsList.appendChild(div);

        if (c.favourite) {
            const favDiv = div.cloneNode(true);
            favList.appendChild(favDiv);
        }
    });
}

// ========================
// View contact details (right phone screen)
// ========================
let selectedContactId = null;

function showContactDetails(id) {
    const c = contacts.find(ct => ct.id === id);
    if (!c) return;
    selectedContactId = id;

    const avatar = document.getElementById('detailAvatar');
    const nameEl = document.getElementById('detailName');
    const numEl = document.getElementById('detailNumber');
    const mobileInfo = document.getElementById('detailMobile');
    const groupInfo = document.getElementById('detailGroup');

    if (avatar) avatar.textContent = c.name[0];
    if (nameEl) nameEl.textContent = c.name;
    if (numEl) numEl.textContent = c.phone;
    if (mobileInfo) mobileInfo.textContent = c.phone;
    if (groupInfo) groupInfo.textContent = c.group || 'Personal';

    // switch to details slide if you have a separate slide, otherwise just update UI
}

// ========================
// Search contacts
// ========================
function searchContacts() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    const q = input.value.toLowerCase();

    const filtered = contacts.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q)
    );
    displayContactsListOnly(filtered);
}

function displayContactsListOnly(list) {
    const contactsList = document.getElementById('contactsList');
    if (!contactsList) return;

    contactsList.innerHTML = '';
    list.sort((a, b) => a.name.localeCompare(b.name));

    list.forEach(c => {
        const div = document.createElement('div');
        div.className = 'contact-item';
        div.innerHTML = `
            <div class="avatar">${c.name[0]}</div>
            <div class="contact-info">
                <div class="contact-item-name">${c.name}</div>
                <div class="contact-item-phone">${c.phone}</div>
            </div>
            <div class="contact-actions">
                <button onclick="showContactDetails(${c.id})" class="action-btn"><i class="fas fa-eye"></i></button>
                <button onclick="toggleFavourite(${c.id})" class="action-btn" title="Favourite">
                    ${c.favourite ? '★' : '☆'}
                </button>
                <button onclick="addMissed(${c.id})" class="action-btn" title="Add missed">
                    <i class="fas fa-phone-slash"></i>
                </button>
                <button onclick="deleteContact(${c.id})" class="action-btn" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        contactsList.appendChild(div);
    });
}

// ========================
// Filter by group (tab buttons inside All Contacts slide)
// ========================
function filterContacts(type, btn) {
    currentFilter = type;

    // remove active from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    if (btn) btn.classList.add('active');

    displayContacts(type);
}

// ========================
// Toggle favourite
// ========================
function toggleFavourite(id) {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;
    contact.favourite = !contact.favourite;
    saveContacts();
    displayContacts(currentFilter);
}

// ========================
// Delete contact
// ========================
function deleteContact(id) {
    if (!confirm('Delete this contact?')) return;
    contacts = contacts.filter(c => c.id !== id);
    saveContacts();
    displayContacts(currentFilter);
}

// ========================
// Missed calls
// ========================
function addMissed(id) {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;
    missedCalls.unshift({
        id: Date.now(),
        contactId: id,
        name: contact.name,
        phone: contact.phone,
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

    list.innerHTML = sorted
        .map(c => `
        <div class="contact-card">
            <div>${c.name} (${c.phone})</div>
            <small>${new Date(c.time).toLocaleString()}</small>
        </div>
    `)
        .join('');
}

function clearMissed() {
    if (!confirm('Clear all missed calls?')) return;
    missedCalls = [];
    saveMissed();
    displayMissed();
}

// ========================
// Modal open/close for Add Contact
// ========================
function openAddForm() {
    const modal = document.getElementById('addModal');
    if (modal) modal.style.display = 'flex';
}

function closeAddForm() {
    const modal = document.getElementById('addModal');
    if (modal) modal.style.display = 'none';
}

// ========================
// Init on page load
// ========================
document.addEventListener('DOMContentLoaded', () => {
    // attach form submit
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', addContact);
    }

    // attach search
    const search = document.getElementById('searchInput');
    if (search) {
        search.addEventListener('input', searchContacts);
    }

    // initial UI
    displayContacts();
    displayMissed();
    showSlide('home');
});