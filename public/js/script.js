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

document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.getElementById('toggle-filters');
  const filterOptions = document.getElementById('filter-options');

  // On mobile, ensure the filter options are hidden by default
  if (window.innerWidth <= 768) {
    filterOptions.classList.add('hidden');
  }

  toggleButton.addEventListener('click', function () {
    filterOptions.classList.toggle('visible');
    filterOptions.classList.toggle('hidden');
    toggleButton.textContent = filterOptions.classList.contains('visible')
      ? 'Hide Filters'
      : 'Show Filters';

    // Update accessibility
    toggleButton.setAttribute(
      'aria-expanded',
      filterOptions.classList.contains('visible') ? 'true' : 'false'
    );
  });
});
