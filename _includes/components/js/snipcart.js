// Snipcart items counter badges / labels
document.addEventListener('snipcart.ready', () => {
  Snipcart.store.subscribe(() => {
      var count = Snipcart.store.getState().cart.items.count;
      [...document.querySelectorAll('.snipcart-items-counter')].forEach(el => el.textContent = count ? count : null);
  });
});