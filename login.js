// login.js
document.getElementById('loginBtn').addEventListener('click', function () {
  const name = document.getElementById('name').value.trim();
  const vehicle = document.getElementById('vehicle').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!name || !vehicle || !email || !password) {
    alert('Please fill all fields.');
    return;
  }

  // Save user (do NOT store plain passwords in production)
  const user = { name, vehicle, email };
  localStorage.setItem('smartparking_user', JSON.stringify(user));

  // initialize demo floors the first time
  const FLOORS_KEY = 'smartparking_demoFloors';
  if (!localStorage.getItem(FLOORS_KEY)) {
    const demo = [
      { floorNo: 1, slots: [{id:'1A', taken:false},{id:'1B', taken:true},{id:'1C', taken:false},{id:'1D', taken:false}] },
      { floorNo: 2, slots: [{id:'2A', taken:false},{id:'2B', taken:true},{id:'2C', taken:true},{id:'2D', taken:false}] },
      { floorNo: 3, slots: [{id:'3A', taken:false},{id:'3B', taken:false},{id:'3C', taken:false},{id:'3D', taken:true}] },
      { floorNo: 4, slots: [{id:'4A', taken:true},{id:'4B', taken:false},{id:'4C', taken:false},{id:'4D', taken:false}] }
    ];
    localStorage.setItem(FLOORS_KEY, JSON.stringify(demo));
  }

  // go to parking page
  window.location.href = 'parking.html';
});
