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

function addContact() {
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    if (!name || !phone) return alert('Name and phone required!');
    contacts.push({ name, phone, email });
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

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = contacts.filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.phone.includes(query) || 
        c.email.toLowerCase().includes(query)
    );
    displayContacts(filtered);
});

addBtn.addEventListener('click', addContact);

displayContacts(); // Load on start