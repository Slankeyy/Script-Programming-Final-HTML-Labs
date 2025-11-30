// Lab 11: JavaScript Forms

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm11');
  const submitBtn = document.getElementById('submitBtn11');
  const formResults = document.getElementById('formResults');

  if (!form) return;

  // Handle form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Collect form data
    const formData = {
      name: document.getElementById('name11').value.trim(),
      surname: document.getElementById('surname11').value.trim(),
      email: document.getElementById('email11').value.trim(),
      phone: document.getElementById('phone11').value.trim(),
      address: document.getElementById('address11').value.trim(),
      rating1: parseInt(document.getElementById('rating1').value) || 0,
      rating2: parseInt(document.getElementById('rating2').value) || 0,
      rating3: parseInt(document.getElementById('rating3').value) || 0
    };

    // Print to console
    console.log('Form Data:', formData);

    // Calculate average rating
    const averageRating = (formData.rating1 + formData.rating2 + formData.rating3) / 3;

    // Display results
    displayResults(formData, averageRating);

    // Show success popup
    showSuccessPopup();

    // Reset form
    form.reset();
  });

  function displayResults(data, average) {
    const resultsHTML = `
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Surname:</strong> ${data.surname}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone number:</strong> ${data.phone}</p>
      <p><strong>Address:</strong> ${data.address}</p>
      <div id="averageRating" style="color: ${getAverageColor(average)};">
        <strong>${data.name} ${data.surname}: ${average.toFixed(1)}</strong>
      </div>
    `;

    formResults.innerHTML = resultsHTML;
    formResults.style.display = 'block';

    // Scroll to results
    setTimeout(() => {
      formResults.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  function getAverageColor(average) {
    if (average < 4) return '#ff0000'; // Red
    if (average < 7) return '#ff9800'; // Orange
    return '#4CAF50'; // Green
  }

  function showSuccessPopup() {
    // Create overlay
    let overlay = document.querySelector('.success-popup-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'success-popup-overlay';
      document.body.appendChild(overlay);
    }

    // Create popup
    let popup = document.querySelector('.success-popup');
    if (!popup) {
      popup = document.createElement('div');
      popup.className = 'success-popup';
      document.body.appendChild(popup);
    }

    popup.textContent = 'Form submitted successfully!';
    overlay.classList.add('show');

    // Remove after 3 seconds
    setTimeout(() => {
      overlay.classList.remove('show');
    }, 3000);
  }
});
