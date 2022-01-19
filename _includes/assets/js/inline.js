// Snipcart items counter badges / labels
document.addEventListener('snipcart.ready', () => {
    Snipcart.store.subscribe(() => {
        var count = Snipcart.store.getState().cart.items.count;
        [...document.querySelectorAll('.snipcart-items-counter')].forEach(el => el.textContent = count ? count : null);
    });
});


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
