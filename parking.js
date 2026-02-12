// parking.js
// Keys
const USER_KEY = 'smartparking_user';
const FLOORS_KEY = 'smartparking_demoFloors';
const BOOKING_KEY = 'smartparking_booking';

// Get user
const user = JSON.parse(localStorage.getItem(USER_KEY));
if (!user) {
  alert('Please login first.');
  window.location.href = 'login.html';
}

// UI refs
const welcomeText = document.getElementById('welcomeText');
const floorsWrap = document.getElementById('floorsWrap');
const globalStats = document.getElementById('globalStats');
const rateInput = document.getElementById('rateInput');
const hoursInput = document.getElementById('hoursInput');
const selectionSummary = document.getElementById('selectionSummary');
const selectedSlotText = document.getElementById('selectedSlotText');
const hoursDisplay = document.getElementById('hoursDisplay');
const rateDisplay = document.getElementById('rateDisplay');
const totalDisplay = document.getElementById('totalDisplay');
const confirmBtn = document.getElementById('confirmBtn');
const clearSelectionBtn = document.getElementById('clearSelectionBtn');
const refreshBtn = document.getElementById('refreshBtn');
const logoutBtn = document.getElementById('logoutBtn');

welcomeText.innerText = `Hello ${user.name} • ${user.vehicle} • ${user.email}`;

let floors = JSON.parse(localStorage.getItem(FLOORS_KEY) || '[]');
let selected = null; // {floorIndex, slotIndex}

// render stats and floors
function renderGlobalStats() {
  let totalSlots = 0, totalOccupied = 0;
  floors.forEach(f => {
    totalSlots += f.slots.length;
    totalOccupied += f.slots.filter(s => s.taken).length;
  });
  const totalAvailable = totalSlots - totalOccupied;

  globalStats.innerHTML = `
    <div class="stat"><div class="small">Total slots</div><strong>${totalSlots}</strong></div>
    <div class="stat"><div class="small">Available</div><strong style="color:#047a3b">${totalAvailable}</strong></div>
    <div class="stat"><div class="small">Occupied</div><strong style="color:#8b1d2c">${totalOccupied}</strong></div>
    <div class="stat"><div class="small">Logged in as</div><strong>${user.name}</strong><div class="small">${user.vehicle}</div></div>
  `;
}

function renderFloors() {
  floorsWrap.innerHTML = '';
  floors.forEach((floor, fi) => {
    const card = document.createElement('div');
    card.className = 'floor-card';
    const takenCount = floor.slots.filter(s => s.taken).length;
    const availableCount = floor.slots.length - takenCount;

    const title = document.createElement('div');
    title.className = 'floor-title';
    title.innerHTML = `<h2>Floor ${floor.floorNo}</h2><div class="small">Available: ${availableCount} • Occupied: ${takenCount}</div>`;
    card.appendChild(title);

    const slotsWrap = document.createElement('div');
    slotsWrap.className = 'slots';

    floor.slots.forEach((s, si) => {
      const el = document.createElement('div');
      el.className = 'slot ' + (s.taken ? 'occupied' : 'available');
      el.textContent = s.id;
      if (!s.taken) {
        el.addEventListener('click', () => {
          document.querySelectorAll('.slot.selected').forEach(x => x.classList.remove('selected'));
          el.classList.add('selected');
          selected = { floorIndex: fi, slotIndex: si };
          updateSummary();
        });
      } else {
        el.title = 'Occupied';
      }
      slotsWrap.appendChild(el);
    });

    card.appendChild(slotsWrap);
    floorsWrap.appendChild(card);
  });
}

function updateSummary() {
  if (!selected) {
    selectionSummary.style.display = 'none';
    return;
  }
  const slotObj = floors[selected.floorIndex].slots[selected.slotIndex];
  selectedSlotText.innerText = `Floor ${floors[selected.floorIndex].floorNo} - ${slotObj.id}`;
  const rate = Number(rateInput.value) || 0;
  const hours = Number(hoursInput.value) || 1;
  rateDisplay.innerText = rate.toFixed(2);
  hoursDisplay.innerText = hours;
  totalDisplay.innerText = (rate * hours).toFixed(2);
  selectionSummary.style.display = 'block';
}

// confirm booking
confirmBtn.addEventListener('click', () => {
  if (!selected) {
    alert('Please select a slot first.');
    return;
  }
  // mark occupied
  floors[selected.floorIndex].slots[selected.slotIndex].taken = true;

  const hours = Number(hoursInput.value) || 1;
  const rate = Number(rateInput.value) || 0;
  const total = rate * hours;
  const booking = {
    user,
    floor: floors[selected.floorIndex].floorNo,
    slot: floors[selected.floorIndex].slots[selected.slotIndex].id,
    hours, rate, total,
    createdAt: new Date().toISOString()
  };

  // persist booking and floors
  localStorage.setItem(BOOKING_KEY, JSON.stringify(booking));
  localStorage.setItem(FLOORS_KEY, JSON.stringify(floors));

  alert(`Booked Floor ${booking.floor} - ${booking.slot}\nTotal: ₹ ${booking.total.toFixed(2)}`);

  // reset selection and re-render
  selected = null;
  renderFloors();
  renderGlobalStats();
  updateSummary();

  // go to confirm page
  window.location.href = 'confirm.html';
});

clearSelectionBtn.addEventListener('click', () => {
  selected = null;
  document.querySelectorAll('.slot.selected').forEach(x => x.classList.remove('selected'));
  updateSummary();
});

refreshBtn.addEventListener('click', () => {
  floors = JSON.parse(localStorage.getItem(FLOORS_KEY) || '[]');
  renderFloors();
  renderGlobalStats();
  updateSummary();
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem(USER_KEY);
  window.location.href = 'login.html';
});

rateInput.addEventListener('input', updateSummary);
hoursInput.addEventListener('input', updateSummary);

// initial render
renderGlobalStats();
renderFloors();
updateSummary();
