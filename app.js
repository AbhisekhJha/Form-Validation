"use strict";
class FormValidator {
    constructor() {
        this.fields = ['name', 'email', 'password', 'confirmPassword'];
        this.form = document.getElementById('registrationForm');
        this.successMsg = document.getElementById('successMessage');
        this.rules = {
            name: [
                { validate: v => v.trim().length > 0, message: 'Name is required' },
                { validate: v => v.trim().length >= 2, message: 'Name must be at least 2 characters long' },
                { validate: v => /^[a-zA-Z\s]+$/.test(v.trim()), message: 'Name can only contain letters and spaces' }
            ],
            email: [
                { validate: v => v.trim().length > 0, message: 'Email is required' },
                { validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), message: 'Please enter a valid email address' }
            ],
            password: [
                { validate: v => v.length > 0, message: 'Password is required' },
                { validate: v => v.length >= 8, message: 'Password must be at least 8 characters long' },
                { validate: v => /[A-Z]/.test(v), message: 'Password must contain at least one uppercase letter' },
                { validate: v => /[a-z]/.test(v), message: 'Password must contain at least one lowercase letter' },
                { validate: v => /[0-9]/.test(v), message: 'Password must contain at least one number' },
                { validate: v => /[!@#$%^&*(),.?":{}|<>]/.test(v), message: 'Password must contain at least one special character' }
            ],
            confirmPassword: [
                { validate: v => v.length > 0, message: 'Please confirm your password' },
                { validate: (v, data) => data ? v === data.password : false, message: 'Passwords do not match' }
            ]
        };
        this.init();
    }
    getInput(field) {
        const id = field === 'confirmPassword' ? 'confirmPassword' : field;
        return document.getElementById(id);
    }
    getError(field) {
        const id = field === 'confirmPassword' ? 'confirmPasswordError' : `${field}Error`;
        return document.getElementById(id);
    }
    getFormData() {
        return {
            name: this.getInput('name').value,
            email: this.getInput('email').value,
            password: this.getInput('password').value,
            confirmPassword: this.getInput('confirmPassword').value
        };
    }
    validateField(field) {
        const formData = this.getFormData();
        const value = formData[field];
        const input = this.getInput(field);
        const error = this.getError(field);
        for (const rule of this.rules[field]) {
            if (!rule.validate(value, formData)) {
                input.classList.add('error');
                input.classList.remove('success');
                error.textContent = rule.message;
                return false;
            }
        }
        input.classList.remove('error');
        input.classList.add('success');
        error.textContent = '';
        return true;
    }
    clearError(field) {
        this.getInput(field).classList.remove('error');
        this.getError(field).textContent = '';
    }
    validateAll() {
        return this.fields.every(field => this.validateField(field));
    }
    handleSubmit(e) {
        e.preventDefault();
        this.successMsg.classList.remove('show');
        if (this.validateAll()) {
            const data = this.getFormData();
            this.successMsg.textContent = `Registration successful! Welcome, ${data.name}!`;
            this.successMsg.classList.add('show');
            console.log('Form submitted:', {
                name: data.name,
                email: data.email,
                passwordLength: data.password.length
            });
            setTimeout(() => this.reset(), 3000);
        }
    }
    reset() {
        this.form.reset();
        this.fields.forEach(field => {
            this.getInput(field).classList.remove('success', 'error');
            this.getError(field).textContent = '';
        });
        this.successMsg.classList.remove('show');
    }
    init() {
        this.form.addEventListener('submit', e => this.handleSubmit(e));
        this.fields.forEach(field => {
            this.getInput(field).addEventListener('blur', () => this.validateField(field));
            this.getInput(field).addEventListener('input', () => this.clearError(field));
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    try {
        new FormValidator();
    }
    catch (error) {
        console.error('Failed to initialize form validator:', error);
    }
});
