/*
if (window.netlifyIdentity) {
  window.netlifyIdentity.on("init", user => {
    if (!user) {
      window.netlifyIdentity.on("login", () => {
        document.location.href = "/admin/";
      });
    }
  });
}
*/
document.addEventListener('snipcart.ready', () => {
    Snipcart.store.subscribe(() => {
        var count = Snipcart.store.getState().cart.items.count;
        [...document.querySelectorAll('.snipcart-items-counter')].forEach(el => el.textContent = count ? count : null);
    });
});