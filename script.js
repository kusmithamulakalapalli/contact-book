const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email');
const addBtn = document.getElementById('add-btn');
const searchInput = document.getElementById('search');
const contactList = document.getElementById('contact-list');

let contacts = JSON.parse(localStorage.getItem('contacts')) || [];

function displayContacts(contactsToShow = contacts) {
    contactList.innerHTML = '';
    contactsToShow.forEach((contact, index) => {
        const li = document.createElement('li');
        li.className = 'contact-item';
        li.innerHTML = `
            <div>
                <strong>${contact.name}</strong><br>
                📞 ${contact.phone}<br>
                ✉️ ${contact.email}
            </div>
            <button class="delete-btn" onclick="deleteContact(${index})">🗑️ Delete</button>
        `;
        contactList.appendChild(li);
    });
}

function toggleFavorite(index) {
    contacts[index].favorite = !contacts[index].favorite;
    localStorage.setItem('contacts', JSON.stringify(contacts));
    displayContacts();
}
function addContact() {
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    const phoneClean = phone.replace(/D/g, '');
if (!/^d{10}$/.test(phoneClean)) {
    alert('Phone number must be exactly 10 digits.');
    return;
}
    if (!name || !phone) return alert('Name and phone required!');
    contacts.push({ name, phone: phoneclean, email,favorite: false });
    contacts.sort((a, b) => a.name.localeCompare(b.name)); // Auto-sort
    localStorage.setItem('contacts', JSON.stringify(contacts));
    displayContacts();
    nameInput.value = phoneInput.value = emailInput.value = '';
}

function deleteContact(index) {
    contacts.splice(index, 1);
    localStorage.setItem('contacts', JSON.stringify(contacts));
    displayContacts();
}

function toggleFavorite(index) {
    contacts[index].favorite = !contacts[index].favorite;
    sortContacts();
    localStorage.setItem('contacts', JSON.stringify(contacts));
    displayContacts();
}

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = contacts.filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.phone.includes(query) || 
        c.email.toLowerCase().includes(query)
    );
    displayContacts(filtered);
});

addBtn.onclick = addContact;

function downloadContacts() {
    const dataStr = JSON.stringify(contacts, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

downloadBtn.addEventListener('click', downloadContacts);

function sortContacts() {
    contacts.sort((a, b) => {
        if ((a.favorite || false) !== (b.favorite || false)) {
            return a.favorite ? -1 : 1; // favourites first
        }
        return a.name.localeCompare(b.name); // then A–Z
    });
}

function displayContacts(contactsToShow = contacts) {
    contactList.innerHTML = '';
    contactsToShow.forEach((contact, index) => {
        const favIcon = contact.favorite ? '⭐' : '☆';

        const li = document.createElement('li');
        li.className = 'contact-item';
        li.innerHTML = `
            <div class="contact-info">
                <strong>${contact.name}</strong>
                <span>📞 ${contact.phone}</span>
                <span>✉️ ${contact.email || ''}</span>
            </div>
            <div class="contact-actions">
                <button class="icon-btn" title="Favourite" onclick="toggleFavorite(${index})">
                    ${favIcon}
                </button>
                <button class="edit-btn" onclick="editContact(${index})">✏️ Edit</button>
                <button class="delete-btn" onclick="deleteContact(${index})">🗑️ Delete</button>
            </div>
        `;
        contactList.appendChild(li);
    });
}