class ContactFormHandler {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.resultsDiv = document.getElementById('formResults');
    this.successPopup = document.getElementById('successPopup');
    this.closeBtn = document.querySelector('.popup-close');
    
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      this.setupRealTimeValidation();
    }
    
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.hidePopup());
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const formData = {
      name: document.getElementById('name').value.trim(),
      surname: document.getElementById('surname').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      address: document.getElementById('address').value.trim(),
      rating1: parseInt(document.getElementById('rating1').value),
      rating2: parseInt(document.getElementById('rating2').value),
      rating3: parseInt(document.getElementById('rating3').value),
    };

    // Validate form
    if (!this.validateForm(formData)) {
      return;
    }

    // Calculate average rating
    const avgRating = (formData.rating1 + formData.rating2 + formData.rating3) / 3;

    // Display results
    this.displayResults(formData, avgRating);

    // Log to console
    console.log('Form Data:', formData);
    console.log('Average Rating:', avgRating.toFixed(1));

    // Show success popup
    this.showPopup();

    // Reset form
    this.form.reset();
  }

  validateForm(data) {
    const errors = [];
    
    if (!data.name || !data.name.match(/^[a-zA-Z\s]+$/)) {
      errors.push('Name must contain only letters');
    }
    if (!data.surname || !data.surname.match(/^[a-zA-Z\s]+$/)) {
      errors.push('Surname must contain only letters');
    }
    if (!data.email || !data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.push('Invalid email format');
    }
    if (!data.phone || !data.phone.match(/^\+?370\s?\d{1,2}\s?\d{3}\s?\d{4}$|^\+?370\d{9}$/)) {
      errors.push('Invalid phone format');
    }
    if (!data.address || data.address.length < 5) {
      errors.push('Address must be at least 5 characters');
    }

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return false;
    }
    return true;
  }

  displayResults(data, avgRating) {
    const ratingColor = this.getRatingColor(avgRating);
    
    const resultsHTML = `
      <div class="results-container">
        <h4>Form Results:</h4>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Surname:</strong> ${data.surname}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone number:</strong> ${data.phone}</p>
        <p><strong>Address:</strong> ${data.address}</p>
        <p><strong>Question 1 Rating:</strong> ${data.rating1}/10</p>
        <p><strong>Question 2 Rating:</strong> ${data.rating2}/10</p>
        <p><strong>Question 3 Rating:</strong> ${data.rating3}/10</p>
        <p class="average-rating"><strong>${data.name} ${data.surname}: <span class="${ratingColor}">${avgRating.toFixed(1)}</span></strong></p>
      </div>
    `;
    
    this.resultsDiv.innerHTML = resultsHTML;
  }

  getRatingColor(rating) {
    if (rating < 4) return 'rating-red';
    if (rating < 7) return 'rating-orange';
    return 'rating-green';
  }

  showPopup() {
    if (this.successPopup) {
      this.successPopup.style.display = 'block';
    }
  }

  hidePopup() {
    if (this.successPopup) {
      this.successPopup.style.display = 'none';
    }
  }

  setupRealTimeValidation() {
    const nameField = document.getElementById('name');
    const surnameField = document.getElementById('surname');
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');
    const addressField = document.getElementById('address');
    const submitBtn = document.querySelector('button[type="submit"]');

    // Setup rating sliders
    const rating1 = document.getElementById('rating1');
    const rating2 = document.getElementById('rating2');
    const rating3 = document.getElementById('rating3');

    if (rating1) {
      rating1.addEventListener('input', (e) => {
        document.getElementById('rating1Value').textContent = e.target.value;
      });
    }
    if (rating2) {
      rating2.addEventListener('input', (e) => {
        document.getElementById('rating2Value').textContent = e.target.value;
      });
    }
    if (rating3) {
      rating3.addEventListener('input', (e) => {
        document.getElementById('rating3Value').textContent = e.target.value;
      });
    }

    const validateField = (field, pattern, minLength = 0) => {
      const isValid = field.value.trim().length >= minLength && pattern.test(field.value.trim());
      field.classList.toggle('input-error', !isValid);
      this.updateSubmitButton(submitBtn);
      return isValid;
    };

    if (nameField) nameField.addEventListener('input', () => {
      validateField(nameField, /^[a-zA-Z\s]*$/, 1);
    });

    if (surnameField) surnameField.addEventListener('input', () => {
      validateField(surnameField, /^[a-zA-Z\s]*$/, 1);
    });

    if (emailField) emailField.addEventListener('input', () => {
      validateField(emailField, /^[^\s@]*@?[^\s@]*\.?[^\s@]*$/, 0);
    });

    if (phoneField) phoneField.addEventListener('input', (e) => {
      this.formatPhone(e);
      validateField(phoneField, /^\+?370\s?\d{1,2}\s?\d{3}\s?\d{4}$|^\+?370\d{9}$/, 0);
    });

    if (addressField) addressField.addEventListener('input', () => {
      validateField(addressField, /^.{5,}$/, 5);
    });
  }

  formatPhone(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (!value.startsWith('370')) {
      if (value.startsWith('370')) {
        // Already correct
      } else if (value.startsWith('70')) {
        value = '3' + value;
      } else if (!value.startsWith('3')) {
        value = '370' + value;
      }
    }

    if (value.length > 12) {
      value = value.substring(0, 12);
    }

    if (value.length >= 3) {
      value = '+' + value.substring(0, 3) + ' ' + value.substring(3, 5) + ' ' + value.substring(5, 8) + ' ' + value.substring(8);
    }

    e.target.value = value.trim();
  }

  updateSubmitButton(btn) {
    const isFormValid = this.isAllFieldsValid();
    btn.disabled = !isFormValid;
  }

  isAllFieldsValid() {
    const nameField = document.getElementById('name');
    const surnameField = document.getElementById('surname');
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');
    const addressField = document.getElementById('address');

    return (
      nameField && nameField.value.trim().match(/^[a-zA-Z\s]+$/) &&
      surnameField && surnameField.value.trim().match(/^[a-zA-Z\s]+$/) &&
      emailField && emailField.value.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
      phoneField && phoneField.value.trim().match(/^\+?370\s?\d{1,2}\s?\d{3}\s?\d{4}$|^\+?370\d{9}$/) &&
      addressField && addressField.value.trim().length >= 5
    );
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ContactFormHandler();
});
