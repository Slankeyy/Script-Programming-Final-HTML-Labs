// Lab 11: JavaScript Forms - Form handling and validation

(function() {
  'use strict';

  // Form elements
  const form = document.getElementById('contactForm');
  const submitBtn = document.querySelector('.submit-btn');
  const resultsDiv = document.getElementById('formResults');
  const successPopup = document.querySelector('.success-popup');
  const popupOverlay = document.querySelector('.popup-overlay');
  const closePopupBtn = document.querySelector('.popup-close');

  // Form fields
  const fields = {
    name: document.getElementById('name'),
    surname: document.getElementById('surname'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    address: document.getElementById('address'),
    rating1: document.getElementById('rating1'),
    rating2: document.getElementById('rating2'),
    rating3: document.getElementById('rating3')
  };

  // Validation regex patterns
  const patterns = {
    name: /^[a-zA-Z\s]+$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^(\+370|0)[0-9]{8,9}$/,
    address: /^.{5,}$/
  };

  // Real-time validation for optional task
  if (fields.name) {
    fields.name.addEventListener('blur', () => validateField(fields.name, 'name'));
    fields.name.addEventListener('input', () => validateField(fields.name, 'name'));
  }

  if (fields.surname) {
    fields.surname.addEventListener('blur', () => validateField(fields.surname, 'surname'));
    fields.surname.addEventListener('input', () => validateField(fields.surname, 'surname'));
  }

  if (fields.email) {
    fields.email.addEventListener('blur', () => validateField(fields.email, 'email'));
    fields.email.addEventListener('input', () => validateField(fields.email, 'email'));
  }

  if (fields.phone) {
    fields.phone.addEventListener('input', maskPhoneNumber);
  }

  if (fields.address) {
    fields.address.addEventListener('blur', () => validateField(fields.address, 'address'));
    fields.address.addEventListener('input', () => validateField(fields.address, 'address'));
  }

  // Update rating display values
  if (fields.rating1) {
    fields.rating1.addEventListener('input', (e) => {
      document.getElementById('rating1-value').textContent = e.target.value;
    });
  }

  if (fields.rating2) {
    fields.rating2.addEventListener('input', (e) => {
      document.getElementById('rating2-value').textContent = e.target.value;
    });
  }

  if (fields.rating3) {
    fields.rating3.addEventListener('input', (e) => {
      document.getElementById('rating3-value').textContent = e.target.value;
    });
  }

  // Form submission
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }

  // Close popup button
  if (closePopupBtn) {
    closePopupBtn.addEventListener('click', closePopup);
  }

  // Validate individual field
  function validateField(field, type) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    if (!value) {
      isValid = false;
      errorMessage = 'This field is required';
    } else {
      switch (type) {
        case 'name':
        case 'surname':
          if (!patterns.name.test(value)) {
            isValid = false;
            errorMessage = 'Only letters are allowed';
          }
          break;
        case 'email':
          if (!patterns.email.test(value)) {
            isValid = false;
            errorMessage = 'Invalid email format';
          }
          break;
        case 'phone':
          if (!patterns.phone.test(value.replace(/\s/g, '').replace(/-/g, ''))) {
            isValid = false;
            errorMessage = 'Invalid Lithuanian phone number';
          }
          break;
        case 'address':
          if (!patterns.address.test(value)) {
            isValid = false;
            errorMessage = 'Address must be at least 5 characters';
          }
          break;
      }
    }

    const fieldGroup = field.closest('.form-group');
    const errorText = fieldGroup.querySelector('.error-text');

    if (isValid) {
      fieldGroup.classList.remove('error');
      fieldGroup.classList.add('success');
      if (errorText) errorText.textContent = '';
    } else {
      fieldGroup.classList.remove('success');
      fieldGroup.classList.add('error');
      if (errorText) errorText.textContent = errorMessage;
    }

    updateSubmitButton();
    return isValid;
  }

  // Phone number masking (+370 6xx xxxxx format)
  function maskPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits

    if (value.length > 0) {
      if (!value.startsWith('370') && !value.startsWith('8')) {
        if (value.startsWith('3')) {
          value = '370' + value.substring(1);
        } else {
          value = '370' + value;
        }
      }

      if (value.startsWith('8')) {
        value = '370' + value.substring(1);
      }

      // Format: +370 6xx xxxxx
      if (value.length > 0) {
        value = '+' + value.slice(0, 3) + ' ' + value.slice(3, 4) + value.slice(4, 6) + ' ' + value.slice(6, 9) + ' ' + value.slice(9, 12);
      }
    }

    e.target.value = value;
  }

  // Update submit button state
  function updateSubmitButton() {
    if (!submitBtn) return;

    const allValid = Object.keys(fields).every(key => {
      const field = fields[key];
      if (!field) return true;

      if (key.startsWith('rating')) return true; // Ratings are always valid

      const fieldGroup = field.closest('.form-group');
      return fieldGroup && fieldGroup.classList.contains('success');
    });

    submitBtn.disabled = !allValid;
  }

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();

    // Validate all fields
    let allValid = true;
    Object.keys(fields).forEach(key => {
      const field = fields[key];
      if (!field) return;
      if (!key.startsWith('rating')) {
        if (!validateField(field, key)) {
          allValid = false;
        }
      }
    });

    if (!allValid) return;

    // Collect form data
    const formData = {
      name: fields.name.value.trim(),
      surname: fields.surname.value.trim(),
      email: fields.email.value.trim(),
      phone: fields.phone.value.trim(),
      address: fields.address.value.trim(),
      rating1: parseInt(fields.rating1.value),
      rating2: parseInt(fields.rating2.value),
      rating3: parseInt(fields.rating3.value)
    };

    // Log to console
    console.log('Form Data:', formData);

    // Calculate average rating
    const avgRating = ((formData.rating1 + formData.rating2 + formData.rating3) / 3).toFixed(1);

    // Display results
    displayResults(formData, avgRating);

    // Show success popup
    showSuccessPopup();
  }

  // Display form results
  function displayResults(data, avgRating) {
    const resultsHTML = `
      <h4>Submission Results:</h4>
      <div class="result-item"><strong>Name:</strong> ${data.name}</div>
      <div class="result-item"><strong>Surname:</strong> ${data.surname}</div>
      <div class="result-item"><strong>Email:</strong> ${data.email}</div>
      <div class="result-item"><strong>Phone number:</strong> ${data.phone}</div>
      <div class="result-item"><strong>Address:</strong> ${data.address}</div>
      <div class="average-rating">
        <strong>${data.name} ${data.surname}:</strong>
        <span class="value ${getAverageColor(avgRating)}">${avgRating}</span>
      </div>
    `;

    resultsDiv.innerHTML = resultsHTML;
    resultsDiv.classList.add('show');
  }

  // Get color for average rating
  function getAverageColor(avg) {
    avg = parseFloat(avg);
    if (avg <= 4) return 'red';
    if (avg <= 7) return 'orange';
    return 'green';
  }

  // Show success popup
  function showSuccessPopup() {
    if (successPopup) {
      successPopup.classList.add('show');
    }
    if (popupOverlay) {
      popupOverlay.classList.add('show');
    }
  }

  // Close popup
  function closePopup() {
    if (successPopup) {
      successPopup.classList.remove('show');
    }
    if (popupOverlay) {
      popupOverlay.classList.remove('show');
    }
  }

})();
