// Spinners upon form submit
document.addEventListener('DOMContentLoaded', () => {
[...document.querySelectorAll('form')].forEach(formEl => {
  formEl.addEventListener('submit', e => {
    console.log('form submitted');
    document.documentElement.setAttribute('data-loading', true);
// e.preventDefault();
  })
});
});
