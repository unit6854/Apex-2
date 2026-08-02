/*
 * Cart-page shipping gate for magazine engraving orders.
 *
 * Shopify's checkout cannot be customised without a Shopify Function or a
 * Plus checkout extension, so the real enforcement is the restricted
 * products' shipping profile in the admin. This is the customer-facing
 * stop before that: pick a destination state, and a restricted one blocks
 * the checkout button with the same warning the old site used.
 *
 * Fails open on purpose. If this script never runs, checkout stays clickable
 * and the shipping profile still refuses the address.
 */
class ApexShippingGate extends HTMLElement {
  connectedCallback() {
    this.select = this.querySelector('[data-gate-select]');
    this.warning = this.querySelector('[data-gate-warning]');
    this.prompt = this.querySelector('[data-gate-prompt]');
    this.stateName = this.querySelector('[data-gate-state]');
    if (!this.select) return;

    try {
      this.restricted = JSON.parse(this.dataset.restricted || '[]');
    } catch (e) {
      this.restricted = [];
    }

    this.storageKey = 'apexShippingState';
    this.buttons = this.collectButtons();

    const saved = this.readSaved();
    if (saved) this.select.value = saved;

    this.select.addEventListener('change', () => {
      this.persist(this.select.value);
      this.apply();
    });

    this.apply();
  }

  /* The checkout submit plus any accelerated buttons Shopify injects. */
  collectButtons() {
    const form = this.closest('form') || document;
    const found = [
      ...form.querySelectorAll('#checkout, [name="checkout"]'),
      ...document.querySelectorAll('.cart__dynamic-checkout-buttons button, .cart__dynamic-checkout-buttons input'),
    ];
    return found.filter((el, i) => found.indexOf(el) === i);
  }

  readSaved() {
    try {
      return sessionStorage.getItem(this.storageKey) || '';
    } catch (e) {
      return '';
    }
  }

  persist(value) {
    try {
      sessionStorage.setItem(this.storageKey, value);
    } catch (e) {
      /* Private mode — the gate still works, it just forgets between pages. */
    }
  }

  apply() {
    const value = this.select.value;
    const isBlocked = value !== '' && this.restricted.indexOf(value) !== -1;
    const needsChoice = value === '';

    this.toggleHidden(this.warning, !isBlocked);
    this.toggleHidden(this.prompt, !needsChoice);
    this.classList.toggle('apex-gate--blocked', isBlocked);

    const lock = isBlocked || needsChoice;
    this.buttons.forEach((button) => {
      button.disabled = lock;
      button.setAttribute('aria-disabled', lock ? 'true' : 'false');
    });

    if (isBlocked) {
      if (this.stateName) this.stateName.textContent = value;
      if (this.warning) this.warning.setAttribute('role', 'alert');
    }
  }

  toggleHidden(el, hidden) {
    if (el) el.hidden = hidden;
  }
}

if (!customElements.get('apex-shipping-gate')) {
  customElements.define('apex-shipping-gate', ApexShippingGate);
}
