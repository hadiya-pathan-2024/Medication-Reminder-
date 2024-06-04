document.getElementById('type').addEventListener('change', function () {
  const oneTimeSchedule = document.getElementById('one-time-schedule');
  const recurringSchedule = document.getElementById('recurring-schedule');
  const dayOfWeek = document.getElementById('dayOfWeek');

  if (this.value === 'one-time') {
    oneTimeSchedule.style.display = 'block';
    recurringSchedule.style.display = 'none';
  } else {
    oneTimeSchedule.style.display = 'none';
    recurringSchedule.style.display = 'block';
  }
});

document.getElementById('frequency').addEventListener('change', function () {
  const dayOfWeek = document.getElementById('dayOfWeek');
  if (this.value === 'Weekly') {
    dayOfWeek.style.display = 'block';
  } else {
    dayOfWeek.style.display = 'none';
  }
});


// const logoutAllDevices = async () => {
//   const response = await fetch('/logout-all', {
//     method: 'POST',
//     headers: {
//       'Authorization': `Bearer ${localStorage.getItem('token')}`,
//       'Content-Type': 'application/json',
//     },
//   });

//   if (response.ok) {
//     alert('Logged out from all devices');
//   } else {
//     alert('Failed to log out from all devices');
//   }
// };

// const logoutOtherDevices = async () => {
//   const response = await fetch('/logout-others', {
//     method: 'POST',
//     headers: {
//       'Authorization': `Bearer ${localStorage.getItem('token')}`,
//       'Content-Type': 'application/json',
//     },
//   });

//   if (response.ok) {
//     alert('Logged out from other devices');
//   } else {
//     alert('Failed to log out from other devices');
//   }
// };
