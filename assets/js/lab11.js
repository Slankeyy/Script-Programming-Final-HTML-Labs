// Lab 11: JavaScript Forms - Contact Form Handler

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const resultsDiv = document.getElementById('formResults');
  const successPopup = document.getElementById('successPopup');

  // Form validation rules
  const validationRules = {
    name: { empty: true, letters: true },
    surname: { empty: true, letters: true },
    email: { empty: true, email: true },
    phone: { empty: true, lithuanian: true },
    address: { empty: true, text: true }
  };

  // Real-time validation
  Object.keys(validationRules).forEach(fieldName => {
    const field = document.getElementById(fieldName);
    if (field) {
      field.addEventListener('blur', () => validateField(fieldName));
      field.addEventListener('input', () => validateField(fieldName));
    }
  });

  // Validate individual field
  function validateField(fieldName) {
    const field = document.getElementById(fieldName);
    const rules = validationRules[fieldName];
    let errors = [];

    if (rules.empty && !field.value.trim()) {
      errors.push('This field is required');
    }
    if (rules.letters && field.value && !/^[a-zA-Zą-żĄ-Ż\s'-]*$/.test(field.value)) {
      errors.push('Only letters allowed');
    }
    if (rules.email && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      errors.push('Invalid email format');
    }
    if (rules.lithuanian && field.value && !/^\+370\s6\d{2}\s\d{3}\d{2}$/.test(field.value)) {
      errors.push('Format: +370 6xx xxxxx');
    }
    if (rules.text && field.value && field.value.trim().length < 5) {
      errors.push('Address must be at least 5 characters');
    }

    // Display error feedback
    let errorElement = document.getElementById(`${fieldName}-error`);
    if (errors.length > 0) {
      field.classList.add('input-error');
      if (!errorElement) {
        errorElement = document.createElement('small');
        errorElement.id = `${fieldName}-error`;
        errorElement.className = 'error-text';
        field.parentNode.appendChild(errorElement);
      }
      errorElement.textContent = errors[0];
    } else {
      field.classList.remove('input-error');
      if (errorElement) errorElement.remove();
    }
  }

  // Phone number masking
  const phoneField = document.getElementById('phone');
  if (phoneField) {
    phoneField.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 9) value = value.slice(0, 9);
      
      if (value.length > 0) {
        if (value.length <= 3) {
          e.target.value = '+370 ' + value;
        } else if (value.length <= 5) {
          e.target.value = '+370 ' + value.slice(0, 3) + ' ' + value.slice(3);
        } else {
          e.target.value = '+370 ' + value.slice(0, 3) + ' ' + value.slice(3, 5) + value.slice(5);
        }
      }
    });
  }

  // Update rating display values
  ['rating1', 'rating2', 'rating3'].forEach(id => {
    const slider = document.getElementById(id);
    const valueDisplay = document.getElementById(id + '-value');
    if (slider && valueDisplay) {
      slider.addEventListener('input', function() {
        valueDisplay.textContent = this.value;
      });
    }
  });

  // Check form validity
  function isFormValid() {
    const fields = ['name', 'surname', 'email', 'phone', 'address'];
    for (let field of fields) {
      const el = document.getElementById(field);
      if (!el.value.trim()) return false;
      if (el.classList.contains('input-error')) return false;
    }
    return true;
  }

  // Enable/disable submit button
  const allInputs = form.querySelectorAll('input[type="text"], input[type="email"], textarea');
  allInputs.forEach(input => {
    input.addEventListener('input', () => {
      submitBtn.disabled = !isFormValid();
    });
  });

  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validate all fields
    Object.keys(validationRules).forEach(field => validateField(field));

    if (!isFormValid()) {
      alert('Please fill all fields correctly');
      return;
    }

    // Collect form data
    const formData = {
      name: document.getElementById('name').value.trim(),
      surname: document.getElementById('surname').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      address: document.getElementById('address').value.trim(),
      rating1: parseInt(document.getElementById('rating1').value),
      rating2: parseInt(document.getElementById('rating2').value),
      rating3: parseInt(document.getElementById('rating3').value)
    };

    // Calculate average rating
    const avgRating = (formData.rating1 + formData.rating2 + formData.rating3) / 3;
    const ratingColor = avgRating <= 4 ? 'red' : (avgRating <= 7 ? 'orange' : 'green');

    // Print to console
    console.log(formData);

    // Display results
    resultsDiv.innerHTML = `
      <h4>Form Results:</h4>
      <p><strong>Name:</strong> ${formData.name}</p>
      <p><strong>Surname:</strong> ${formData.surname}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Phone number:</strong> ${formData.phone}</p>
      <p><strong>Address:</strong> ${formData.address}</p>
      <p><strong>Rating 1:</strong> ${formData.rating1}/10</p>
      <p><strong>Rating 2:</strong> ${formData.rating2}/10</p>
      <p><strong>Rating 3:</strong> ${formData.rating3}/10</p>
      <p style="font-size: 18px; font-weight: bold; color: ${ratingColor};">
        ${formData.name} ${formData.surname}: ${avgRating.toFixed(1)}
      </p>
    `;

    // Show success popup
    successPopup.style.display = 'block';
    setTimeout(() => {
      successPopup.style.display = 'none';
    }, 3000);

    // Reset form
    form.reset();
    submitBtn.disabled = true;
  });

  // Close popup on click
  const closeBtn = document.getElementById('closePopup');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      successPopup.style.display = 'none';
    });
  }
});
