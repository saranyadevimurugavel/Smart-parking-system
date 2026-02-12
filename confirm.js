const USER_KEY = 'smartparking_user';
const BOOKING_KEY = 'smartparking_booking';

const user = JSON.parse(localStorage.getItem(USER_KEY));
const booking = JSON.parse(localStorage.getItem(BOOKING_KEY));

if (!user || !booking) {
  alert('No booking found. Redirecting to slot selection.');
  window.location.href = 'parking.html';
}

const info = document.getElementById('info');
info.innerHTML = `
  <div class="summary">
    <div><strong>Name:</strong> ${user.name}</div>
    <div><strong>Vehicle:</strong> ${user.vehicle}</div>
    <div><strong>Slot:</strong> Floor ${booking.floor} - ${booking.slot}</div>
    <div><strong>Hours:</strong> ${booking.hours}</div>
    <div><strong>Rate/hr:</strong> ₹ ${booking.rate}</div>
    <div style="margin-top:8px;"><strong>Total:</strong> ₹ ${booking.total.toFixed(2)}</div>
    <div class="small" style="margin-top:6px;"><strong>Booked at:</strong> ${new Date(booking.createdAt).toLocaleString()}</div>
  </div>
`;

document.getElementById('emailBtn').addEventListener('click', function () {
  const subject = encodeURIComponent('Smart Parking — Booking Confirmation');
  const body = encodeURIComponent(
`Hello ${user.name},

Your parking slot booking is confirmed.

Slot: Floor ${booking.floor} - ${booking.slot}
Vehicle: ${user.vehicle}
Hours: ${booking.hours}
Rate/hr: ₹ ${booking.rate}
Total: ₹ ${booking.total.toFixed(2)}

Thank you,
Smart Parking System`
  );
  window.location.href = `mailto:${user.email}?subject=${subject}&body=${body}`;

  // --- If you want automatic client-side email using EmailJS, uncomment & configure below ---
  // 1) Include the EmailJS SDK script in confirm.html:
  //    <script type="text/javascript" src="https://cdn.emailjs.com/sdk/2.3.2/email.min.js"></script>
  // 2) Initialize with emailjs.init('YOUR_USER_ID');
  // 3) Use the code below (replace SERVICE_ID and TEMPLATE_ID):
  //
  // emailjs.init('YOUR_USER_ID');
  // emailjs.send('SERVICE_ID', 'TEMPLATE_ID', {
  //   to_name: user.name,
  //   to_email: user.email,
  //   slot: `Floor ${booking.floor} - ${booking.slot}`,
  //   vehicle: user.vehicle,
  //   hours: booking.hours,
  //   rate: booking.rate,
  //   total: booking.total
  // }).then(() => { alert('Confirmation email sent.'); }, (err) => { alert('Email failed: ' + err.text); });
});

document.getElementById('backBtn').addEventListener('click', function () {
  window.location.href = 'parking.html';
});
