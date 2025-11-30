/* Lab 11: JavaScript Forms - Contact Form Handler */

(function() {
  'use strict';

  // Form elements
  const form = document.getElementById('lab11-contact-form');
  const submitBtn = document.querySelector('.lab11-submit-btn');
  const resultDiv = document.getElementById('lab11-results');
  const successPopup = document.getElementById('lab11-success-popup');
  const closePopupBtn = document.querySelector('.lab11-close-popup');

  // Rating slider elements
  const rating1 = document.getElementById('lab11-rating1');
  const rating2 = document.getElementById('lab11-rating2');
  const rating3 = document.getElementById('lab11-rating3');

  // Update rating values on change (for number inputs)
  if (rating1) {
    rating1.addEventListener('change', updateSubmitButton);
  }
  if (rating2) {
    rating2.addEventListener('change', updateSubmitButton);
  }
  if (rating3) {
    rating3.addEventListener('change', updateSubmitButton);
  }

  // Form submission handler
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Collect form data
      const formData = {
        name: document.getElementById('lab11-name').value.trim(),
        surname: document.getElementById('lab11-surname').value.trim(),
        email: document.getElementById('lab11-email').value.trim(),
        phone: document.getElementById('lab11-phone').value.trim(),
        address: document.getElementById('lab11-address').value.trim(),
        rating1: parseInt(document.getElementById('lab11-rating1').value),
        rating2: parseInt(document.getElementById('lab11-rating2').value),
        rating3: parseInt(document.getElementById('lab11-rating3').value)
      };

      // Calculate average rating
      const avgRating = (formData.rating1 + formData.rating2 + formData.rating3) / 3;
      const ratingColor = getRatingColor(avgRating);

      // Print to console
      console.log('Form Data:', formData);

      // Display results
      let resultHTML = `
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Surname:</strong> ${formData.surname}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone number:</strong> ${formData.phone}</p>
        <p><strong>Address:</strong> ${formData.address}</p>
        <p><strong>Rating 1:</strong> ${formData.rating1}</p>
        <p><strong>Rating 2:</strong> ${formData.rating2}</p>
        <p><strong>Rating 3:</strong> ${formData.rating3}</p>
        <p style="font-weight: bold; font-size: 18px; color: ${ratingColor};">
          ${formData.name} ${formData.surname}: ${avgRating.toFixed(1)}
        </p>
      `;

      resultDiv.innerHTML = resultHTML;
      resultDiv.style.display = 'block';

      // Show success popup
      successPopup.style.display = 'flex';
    });
  }

  // Color code average rating
  function getRatingColor(avg) {
    if (avg < 4) return '#d32f2f'; // Red
    if (avg < 7) return '#f57c00'; // Orange
    return '#388e3c'; // Green
  }

  // Close popup handler
  if (closePopupBtn) {
    closePopupBtn.addEventListener('click', function() {
      successPopup.style.display = 'none';
    });
  }

  // Close popup on background click
  if (successPopup) {
    successPopup.addEventListener('click', function(e) {
      if (e.target === successPopup) {
        successPopup.style.display = 'none';
      }
    });
  }

  // Real-time validation (Optional Task)
  const nameInput = document.getElementById('lab11-name');
  const surnameInput = document.getElementById('lab11-surname');
  const emailInput = document.getElementById('lab11-email');
  const addressInput = document.getElementById('lab11-address');
  const phoneInput = document.getElementById('lab11-phone');

  // Validation functions
  function validateName(value) {
    return /^[a-zA-Z\s]{2,}$/.test(value);
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateAddress(value) {
    return value.trim().length >= 5;
  }

  function validatePhone(value) {
    return /^(\+370\s6\d{2}\s\d{3}\s\d{3})?$|^[0-9]*$/.test(value);
  }

  // Show error function
  function showError(input, message) {
    input.classList.add('lab11-error');
    let errorDiv = input.nextElementSibling;
    if (!errorDiv || !errorDiv.classList.contains('lab11-error-text')) {
      errorDiv = document.createElement('small');
      errorDiv.className = 'lab11-error-text';
      input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }
    errorDiv.textContent = message;
  }

  function clearError(input) {
    input.classList.remove('lab11-error');
    const errorDiv = input.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('lab11-error-text')) {
      errorDiv.remove();
    }
  }

  // Attach validation listeners
  if (nameInput) {
    nameInput.addEventListener('blur', function() {
      if (!this.value.trim()) {
        showError(this, 'Name is required');
      } else if (!validateName(this.value)) {
        showError(this, 'Name must contain only letters');
      } else {
        clearError(this);
      }
      updateSubmitButton();
    });
  }

  if (surnameInput) {
    surnameInput.addEventListener('blur', function() {
      if (!this.value.trim()) {
        showError(this, 'Surname is required');
      } else if (!validateName(this.value)) {
        showError(this, 'Surname must contain only letters');
      } else {
        clearError(this);
      }
      updateSubmitButton();
    });
  }

  if (emailInput) {
    emailInput.addEventListener('blur', function() {
      if (!this.value.trim()) {
        showError(this, 'Email is required');
      } else if (!validateEmail(this.value)) {
        showError(this, 'Invalid email format');
      } else {
        clearError(this);
      }
      updateSubmitButton();
    });
  }

  if (addressInput) {
    addressInput.addEventListener('blur', function() {
      if (!this.value.trim()) {
        showError(this, 'Address is required');
      } else if (!validateAddress(this.value)) {
        showError(this, 'Address must be at least 5 characters');
      } else {
        clearError(this);
      }
      updateSubmitButton();
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', function() {
      // Remove all non-digits
      let value = this.value.replace(/\D/g, '');
      
      if (value.length === 0) {
        this.value = '';
      } else if (value.length <= 3) {
        this.value = '+370 ' + value;
      } else if (value.length <= 5) {
        this.value = '+370 ' + value.slice(0, 1) + ' ' + value.slice(1);
      } else if (value.length <= 8) {
        this.value = '+370 ' + value.slice(0, 1) + ' ' + value.slice(1, 4) + ' ' + value.slice(4);
      } else {
        this.value = '+370 ' + value.slice(0, 1) + ' ' + value.slice(1, 4) + ' ' + value.slice(4, 7);
      }
      
      clearError(this);
      updateSubmitButton();
    });

    phoneInput.addEventListener('blur', function() {
      if (!this.value.trim()) {
        showError(this, 'Phone is required');
      }
      updateSubmitButton();
    });
  }

  // Check form validity
  function isFormValid() {
    const hasErrors = document.querySelectorAll('.lab11-error').length > 0;
    const allFilled = nameInput.value.trim() && surnameInput.value.trim() && 
                      emailInput.value.trim() && phoneInput.value.trim() && 
                      addressInput.value.trim();
    return allFilled && !hasErrors;
  }

  // Update submit button state
  function updateSubmitButton() {
    if (submitBtn) {
      if (isFormValid()) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
      } else {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
        submitBtn.style.cursor = 'not-allowed';
      }
    }
  }

  // Initial button state
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.5';
  }
})();
