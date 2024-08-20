function showPasswordField() {
  document.getElementById('deleteForm').style.display = 'inline';
}

async function handleDelete(event) {
  event.preventDefault();

  const password = document.getElementById('password').value;
  const response = await fetch('/check-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });

  const result = await response.json();
  if (result.success) {
    event.target.submit();
  } else {
    alert('Incorrect password');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const hamburgerIcon = document.querySelector('.hamburger-icon');
  const sidebar = document.querySelector('.sidebar');

  hamburgerIcon.addEventListener('click', function () {
    sidebar.classList.toggle('active');
  });
});
