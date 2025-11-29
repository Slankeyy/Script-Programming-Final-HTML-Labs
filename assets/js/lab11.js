// Lab 11: JavaScript Forms - Contact Form Handler

class ContactFormHandler {
  constructor(formId = 'contactForm') {
    this.form = document.getElementById(formId);
    this.submitBtn = this.form.querySelector('.submit-btn');
    this.resultsDiv = document.getElementById('formResults');
    this.popupOverlay = document.getElementById('popupOverlay');
    this.successPopup = document.getElementById('successPopup');
    this.closePopupBtn = this.successPopup.querySelector('button');
    
    this.formData = {};
    this.errors = {};
    
    this.init();
  }
  
  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.closePopupBtn.addEventListener('click', () => this.closePopup());
  }
  
  collectFormData() {
    this.formData = {
      name: this.form.querySelector('[name="name"]').value.trim(),
      surname: this.form.querySelector('[name="surname"]').value.trim(),
      email: this.form.querySelector('[name="email"]').value.trim(),
      phone: this.form.querySelector('[name="phone"]').value.trim(),
      address: this.form.querySelector('[name="address"]').value.trim(),
      rating1: parseInt(this.form.querySelector('[name="rating1"]').value),
      rating2: parseInt(this.form.querySelector('[name="rating2"]').value),
      rating3: parseInt(this.form.querySelector('[name="rating3"]').value)
    };
  }
  
  displayResults() {
    const resultItems = [
      `Name: ${this.formData.name}`,
      `Surname: ${this.formData.surname}`,
      `Email: ${this.formData.email}`,
      `Phone number: ${this.formData.phone}`,
      `Address: ${this.formData.address}`
    ];
    
    let html = resultItems.map(item => `<div class="form-results-item">${item}</div>`).join('');
    
    // Calculate average rating
    const avgRating = (this.formData.rating1 + this.formData.rating2 + this.formData.rating3) / 3;
    const avgRounded = avgRating.toFixed(1);
    let colorClass = 'rating-red';
    if (avgRating >= 7) colorClass = 'rating-green';
    else if (avgRating >= 4) colorClass = 'rating-orange';
    
    html += `<div class="average-rating ${colorClass}">${this.formData.name} ${this.formData.surname}: ${avgRounded}</div>`;
    
    this.resultsDiv.innerHTML = html;
    this.resultsDiv.classList.add('show');
  }
  
  showSuccessPopup() {
    this.popupOverlay.classList.add('show');
    this.successPopup.classList.add('show');
  }
  
  closePopup() {
    this.popupOverlay.classList.remove('show');
    this.successPopup.classList.remove('show');
  }
  
  handleSubmit(e) {
    e.preventDefault();
    
    this.collectFormData();
    console.log('Form Data:', this.formData);
    
    this.displayResults();
    this.showSuccessPopup();
    
    // Reset form
    this.form.reset();
  }
}

// Initialize form handler when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ContactFormHandler('contactForm');
});
