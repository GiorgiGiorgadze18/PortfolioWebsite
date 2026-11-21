import {categories, categoryPhotos, venues, venuesById, dishesById, matchingDishes, price} from './catalog.js';
import {mountMap} from './map.js';

const app = document.querySelector('#app');
const screen = document.querySelector('#screen');
const dock = document.querySelector('#dock');
const imageRoot = 'assets/images/';
const tabs = [
  ['home', 'Home', 'nav_home.png'], ['cart', 'Cart', 'nav_cart.png'],
  ['order', 'Order', 'nav_order.png'], ['profile', 'Profile', 'nav_profile.png'],
];
const paths = {
  back: 'M15 4l-8 8 8 8',
  filter: 'M3 6h7m4 0h7M3 12h12m4 0h2M3 18h3m4 0h11M10 4v4m5 2v4m-9 2v4',
  search: 'M15.5 15.5L21 21M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z',
  camera: 'M4 7h3l2-3h6l2 3h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm11.5 6a3.5 3.5 0 1 0-7 0 3.5 3.5 0 0 0 7 0Z',
  arrow: 'M4 12h15m-6-6 6 6-6 6',
  up: 'M6 15l6-6 6 6',
};

const state = {
  page: 'splash', venue: 'ori', query: '', category: 'All', cart: new Map(),
  cartBack: 'home', address: '', orders: [], name: 'George Giorgadze', avatar: '',
};
const params = new URLSearchParams(location.search);
app.classList.toggle('hide-chrome', params.get('chrome') === 'off');
let disposeMap = null;
let dialogCount = 0;

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[char]));
}

function image(file, alt = '', className = '') {
  return `<img src="${imageRoot}${file}" alt="${escapeHTML(alt)}" class="${className}" draggable="false">`;
}

function icon(name) {
  return `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="${paths[name]}"/></svg>`;
}

function button(label, action, className = 'primary', value = '') {
  return `<button type="button" class="${className}" data-action="${action}" data-value="${escapeHTML(value)}">${escapeHTML(label)}</button>`;
}

function imageButton(file, label, action, className = '', value = '') {
  return `<button type="button" class="image-button ${className}" aria-label="${escapeHTML(label)}" data-action="${action}" data-value="${escapeHTML(value)}">${image(file)}</button>`;
}

function iconButton(name, label, action, value = '') {
  return `<button type="button" class="icon-button" data-action="${action}" data-value="${escapeHTML(value)}" aria-label="${escapeHTML(label)}">${icon(name)}</button>`;
}

function header(title, back = 'home', right = '') {
  return `<header class="screen-header">
    ${back ? iconButton('back', 'Back', 'go', back) : '<span></span>'}
    <h1>${title}</h1>${right || '<span></span>'}
  </header>`;
}

function locationText(venue) {
  return venue.district === 'Tbilisi' ? 'Tbilisi, Georgia' : `${venue.district} • Tbilisi`;
}

function activeTab(page) {
  if (page === 'restaurant') return 'home';
  if (page === 'payment' || page === 'success') return 'cart';
  return tabs.some(([tab]) => tab === page) ? page : '';
}

function navigate(page, {preserveScroll = false} = {}) {
  const previous = state.page;
  if (page === 'cart' && !['cart', 'payment', 'success'].includes(previous)) {
    state.cartBack = previous === 'restaurant' ? 'restaurant' : 'home';
  }
  state.page = page;
  render(preserveScroll);
}

function render(preserveScroll) {
  disposeMap?.();
  disposeMap = null;
  const scrollY = preserveScroll ? screen.scrollTop : 0;
  const page = state.page;
  const tab = activeTab(page);
  const red = ['splash', 'login', 'signup', 'success'].includes(page);
  app.classList.toggle('tone-red', red);
  app.classList.toggle('light-status', red || page === 'home');
  app.classList.toggle('has-dock', Boolean(tab));
  screen.className = `screen page-${page}`;
  screen.innerHTML = screens[page]();
  screen.scrollTop = scrollY;
  if (!preserveScroll) {
    screen.animate([{opacity: .65, transform: 'translateX(9px)'}, {opacity: 1, transform: 'translateX(0)'}],
      {duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 200, easing: 'ease-out'});
  }
  dock.hidden = !tab;
  if (tab) {
    dock.style.setProperty('--tab', tabs.findIndex(([key]) => key === tab));
    for (const element of dock.querySelectorAll('button')) {
      const selected = element.dataset.value === tab;
      element.classList.toggle('active', selected);
      element.setAttribute('aria-current', selected ? 'page' : 'false');
    }
  }
  if (page === 'cart') bindSlider();
  if (page === 'order' && state.orders.length) {
    disposeMap = mountMap(screen.querySelector('canvas'), screen.querySelector('.map-fallback'), delivery);
    bindDeliveryHandle(screen.querySelector('.map-handle'));
  }
  if (page === 'profile') bindAvatar();
}

dock.innerHTML = `<div class="dock-indicator" aria-hidden="true"></div>${tabs.map(([key, label, file]) =>
  `<button type="button" class="dock-link" data-action="go" data-value="${key}" aria-label="${label}">
    <span class="nav-icon" style="--icon:url('${imageRoot}${file}')"></span><span>${label}</span>
  </button>`).join('')}`;

function welcome(start = false) {
  const label = start ? 'Start ordering' : 'Get started';
  const route = start ? 'home' : 'login';
  return `<div class="welcome">
    ${image('logo_red.png', 'Tsero', 'welcome-logo')}
    ${image('courier_illustration.png', '', 'welcome-art')}
    <div class="welcome-copy">
      <h1>${start ? 'Start ordering from restaurants' : 'Your orders will be delivered to you'}</h1>
      <p>${start ? 'Start ordering from restaurants around your region, town or even around your city! Enjoy your experience!' :
        'Before you make any order, please get started and create account or sign in on our platform.'}</p>
    </div>
    <button class="welcome-next" type="button" data-action="go" data-value="${route}">
      ${image(start ? 'start_ordering.png' : 'get_started.png')}<span>${label}</span>
    </button>
  </div>`;
}

function authField(label, name, email = false) {
  return `<div class="auth-field">
    <label for="${name}">${label}</label>
    <div class="auth-input">
      ${image(email ? 'mail.png' : 'lock.png')}
      <input id="${name}" name="${name}" type="${email ? 'email' : 'password'}"
        autocomplete="off" required ${email ? '' : 'minlength="4"'} maxlength="120"
        placeholder="${email ? 'youremail@gmail.com' : 'Password123.'}">
      ${email ? '' : imageButton('eye_open.png', 'Show password', 'password', 'eye', name)}
    </div>
  </div>`;
}

function auth(signup = false) {
  const label = signup ? 'Sign up' : 'Log in';
  return `<div class="auth">
    <div class="auth-header">
      ${iconButton('back', 'Back', 'go', signup ? 'login' : 'welcome')}
      ${image('logo_bird_white.png', 'Tsero')}
    </div>
    <form class="auth-card" id="auth-form" data-signup="${signup}" autocomplete="off">
      <h1>${label}</h1><p class="auth-subtitle">Tsero Delivery</p>
      ${authField('Email', 'email', true)}${authField('Password', 'password')}
      ${signup ? authField('Confirm password', 'confirm') : ''}
      <div class="auth-options">
        <label class="checkbox"><input type="checkbox"> Remember me</label>
        ${signup ? '' : button('Forgot your password?', 'forgot', 'link')}
      </div>
      <button class="primary wide" type="submit">${label}</button>
      <strong class="or">OR</strong>
      <div class="social">
        ${imageButton('google.png', 'Google demo sign-in', 'provider', '', 'Google')}
        ${imageButton('facebook.png', 'Facebook demo sign-in', 'provider', '', 'Facebook')}
      </div>
      <p class="auth-switch">${signup ? 'Already have an account?' : 'Don’t have an account?'}
      ${button(signup ? 'Log in' : 'Sign up', 'go', 'link', signup ? 'login' : 'signup')}</p>
    </form>
  </div>`;
}

function home() {
  return `<div class="hero">
    ${image('hero.png', '', 'hero-photo')}
    ${image('logo_bird_white.png', 'Tsero', 'hero-logo')}
    <div class="search-box">
      <span class="search-icon">${icon('search')}</span>
      <input type="search" id="search" aria-label="Search menu" placeholder="Search..." autocomplete="off"
        value="${escapeHTML(state.query)}">
      ${iconButton('filter', 'Filter by category', 'filters')}
    </div>
  </div><div id="home-content">${homeContent()}</div>`;
}

function homeContent() {
  if (state.category === 'All' && !state.query.trim()) {
    return `<section aria-labelledby="categories" class="home-content">
      <div class="content heading"><h2 id="categories">Categories</h2>${button('See all', 'filters', 'link')}</div>
      <div class="shelf categories">
        ${categories.slice(1).map(category =>
          `<button class="category" type="button" data-action="category" data-value="${category}">
            ${image(categoryPhotos[category])}<span>${category}</span></button>`).join('')}
      </div>
      <div class="content featured">
        ${imageButton('food_offer.png', 'Food menu offer', 'venue', 'offer', 'ori')}
        <h2>Restaurants in Tbilisi</h2>
        ${venues.map(venue => `<button type="button" class="restaurant-card" data-action="venue"
          data-value="${venue.id}" aria-label="Open ${escapeHTML(venue.name)} menu">
          ${image(venue.photo)}
          <span class="restaurant-info"><span><strong>${venue.name}</strong><small>${locationText(venue)}</small></span>
            <span class="rating">★ ${venue.rating}</span></span>
        </button>`).join('')}
      </div>
    </section>`;
  }
  const matches = matchingDishes(state.query, state.category);
  return `<section class="content results" aria-labelledby="result-heading">
    <div class="heading"><h2 id="result-heading">${state.category === 'All' ? 'Search results' : state.category}</h2>
    ${button('Clear', 'clear', 'link')}</div>
    ${matches.length ? matches.map(resultCard).join('') : '<p class="empty">No matching dishes</p>'}
  </section>`;
}

function updateHome() {
  document.querySelector('#home-content').innerHTML = homeContent();
}

function setCategory(value) {
  state.category = value;
  updateHome();
  screen.scrollTop = 0;
}

function photoButton(dish) {
  return imageButton(dish.photo, `View ${dish.name} photo`, 'dish-photo', 'product-photo', dish.id);
}

function quantityButton(dish) {
  const saved = state.cart.has(dish.id);
  return imageButton(saved ? 'saved_mark.png' : 'add_mark.png', `Select quantity for ${dish.name}`,
    'quantity', 'quantity-button', dish.id);
}

function resultCard(dish) {
  const venue = venuesById.get(dish.venue);
  return `<article class="result-card">
    <button class="result-venue" type="button" data-action="venue" data-value="${venue.id}">
      ${image(venue.photo)}<strong>${venue.name}</strong><span class="rating">★ ${venue.rating}</span>
    </button>
    <div class="result-product">${photoButton(dish)}
      <div><strong>${dish.name}</strong><b class="rating">${price(dish.cents)}</b></div>
      ${quantityButton(dish)}
    </div>
  </article>`;
}

function products(items) {
  return `<div class="shelf products">${items.map(dish => `<article class="product">
    ${photoButton(dish)}<div class="product-meta">
      <strong>${dish.name}</strong><b>${price(dish.cents)}${dish.category === 'Khinkali' ? ' / 1PC' : ''}</b>
      <small>${dish.rating}★</small>${quantityButton(dish)}
    </div>
  </article>`).join('')}</div>`;
}

function restaurant() {
  const venue = venuesById.get(state.venue);
  const cart = `<button type="button" class="icon-button" data-action="go" data-value="cart" aria-label="Open cart">
    <span class="nav-icon" style="--icon:url('${imageRoot}nav_cart.png')"></span></button>`;
  return `${header('Restaurant', 'home', cart)}
    <div class="content restaurant-detail">
      ${image(venue.photo, '', 'restaurant-cover')}
      <div class="venue-details"><span class="rating">★ ${venue.rating}</span>
        <div><strong>${venue.name}</strong><small>${locationText(venue)}</small></div></div>
      <h2>Most ordered</h2>
    </div>${products(venue.menu)}
    <h2 class="content drink-title">Drinks</h2>${products(venue.drinks)}`;
}

function selectedLines() {
  return [...state.cart.values()].filter(line => line.selected);
}

function total(lines = selectedLines()) {
  return lines.reduce((amount, line) => amount + line.dish.cents * line.quantity, 0);
}

function cart() {
  return `${header('My Cart', state.cartBack)}<div class="content cart-content">
    ${state.cart.size ? `${[...state.cart.values()].map(({dish, quantity, selected}) => `<article class="cart-line">
      ${photoButton(dish)}
      <button type="button" class="cart-item" data-action="quantity" data-value="${dish.id}"
        aria-label="Edit ${quantity} ${escapeHTML(dish.name)}">
        <strong>${dish.name}</strong><small>${venuesById.get(dish.venue).name}</small>
        <b>+${price(dish.cents * quantity)}${quantity > 1 ? ` × ${quantity}` : ''}</b>
      </button>
      <button type="button" class="cart-check" data-action="toggle" data-value="${dish.id}"
        aria-pressed="${selected}" aria-label="${selected ? 'Exclude' : 'Include'} ${escapeHTML(dish.name)}"><span>${selected ? '✓' : ''}</span></button>
    </article>`).join('')}
    <p class="cart-total">${total() ? `Total&nbsp; ${price(total())}` : 'Select items to continue'}</p>
    <div class="checkout-slider" ${total() ? '' : 'aria-disabled="true"'}>
      <span class="slider-hint">Slide right</span>
      <button type="button" class="slider-thumb" ${total() ? '' : 'disabled'} aria-label="Swipe to pay ${price(total())}">
        <span>Swipe for buying</span>${icon('arrow')}
      </button>
    </div>` : `<p class="empty">Your cart is empty</p>${button('Browse menu', 'go', 'primary wide', 'restaurant')}`}
  </div>`;
}

function payment() {
  return `${header('Payment', 'cart')}
    <form id="payment-form" class="content payment-form" autocomplete="off">
      <label for="address">Delivery address</label>
      <input id="address" name="address" type="text" placeholder="Street, building or apartment"
        maxlength="160" required value="${escapeHTML(state.address)}">
      <h2>Choose your credit card</h2>
      <div class="payment-card" role="img" aria-label="Demo credit card">
        <span class="card-band"></span><span class="card-circles"></span>
      </div>
      <div class="payment-actions">
        <button type="submit" class="pay">Pay</button>
        <button type="submit" class="image-button google-pay" aria-label="Google Pay demo">${image('google_pay.png')}</button>
        <strong class="or">OR</strong>
        ${imageButton('add_card.png', 'Add new card', 'new-card')}
      </div>
    </form>`;
}

function order() {
  if (!state.orders.length) {
    return `${header('My order', 'home', imageButton('refresh.png', 'Refresh orders', 'refresh', 'refresh'))}
      ${image('empty_orders.png', '', 'empty-orders-art')}
      <div class="content no-orders"><h2>Nothing here...</h2>
        <p>You don’t have any ongoing orders yet.<br>Make sure you ordered something from<br>markets or restaurants.</p>
      </div>`;
  }
  return `<div class="tracking">
    <canvas aria-label="Offline Tbilisi map"></canvas><p class="map-fallback" hidden>Map data is unavailable.</p>
    <div class="map-header">${header('My order')}</div>
    <a class="map-credit" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a>
    <div class="map-zoom">
      <button type="button" aria-label="Zoom in" data-action="zoom" data-value="1.4">+</button>
      <button type="button" aria-label="Zoom out" data-action="zoom" data-value="0.72">−</button>
    </div>
    <button type="button" class="map-handle" data-action="delivery">${icon('up')} Swipe up for delivery details</button>
  </div>`;
}

const profileLinks = [
  ['profile_account.png', 'Manage Account', 'User, Contact Information etc.', 'nickname'],
  ['profile_history.png', 'Order history', 'Check and manage your orders', 'history'],
  ['profile_address.png', 'Addresses', 'Add, remove or change addresses', 'addresses'],
  ['profile_favorite.png', 'Favorites', 'Your chosen and favorite products', 'favorites'],
  ['profile_promo.png', 'My promocodes', 'Free promocodes for your friends', 'promocodes'],
  ['profile_logout.png', 'Sign out', 'Sign out from your account', 'signout'],
];

function profile() {
  return `${header('My Profile')}<div class="content profile">
    <div class="profile-card">
      <button type="button" class="avatar" aria-label="Change profile photo. Long press to view photo." data-action="avatar">
        <img alt="" src="${escapeHTML(state.avatar || imageRoot + 'avatar.png')}"><span>${icon('camera')}</span>
      </button>
      <div><strong>${escapeHTML(state.name)}</strong><small>demo@example.com</small></div>
      ${imageButton('profile_edit.png', 'Edit nickname', 'nickname', 'profile-edit')}
    </div>
    <div class="profile-links">${profileLinks.map(([file, title, subtitle, action]) =>
      `<button type="button" class="profile-link" data-action="${action}">
        ${image(file)}<span><strong>${title}</strong><small>${subtitle}</small></span><b aria-hidden="true">›</b>
      </button>`).join('')}</div>
    ${image('logo_red.png', 'Tsero', 'profile-logo')}
  </div>`;
}

const screens = {
  splash: () => `<div class="splash">${image('logo_white.png', 'Tsero')}</div>`,
  welcome, login: auth, signup: () => auth(true), start: () => welcome(true),
  home, restaurant, cart, payment, order, profile,
  success: () => `${header('Payment', '')}<div class="success">
    ${image('success_mark.png', '', 'success-mark')}<h2>Payment Successful!</h2>
    ${button('Continue', 'go', 'success-continue', 'order')}
  </div>`,
};

function openDialog(title, markup, className = '') {
  const dialog = document.createElement('dialog');
  const titleId = `dialog-title-${++dialogCount}`;
  dialog.className = `overlay ${className}`;
  if (title) {
    dialog.setAttribute('aria-labelledby', titleId);
  } else {
    dialog.setAttribute('aria-label', 'Photo preview');
  }
  dialog.innerHTML = `<div class="dialog-body">${title ? `<h2 id="${titleId}">${escapeHTML(title)}</h2>` : ''}${markup}</div>`;
  app.append(dialog);
  let outside = false;
  dialog.addEventListener('pointerdown', event => { outside = event.target === dialog; });
  dialog.addEventListener('click', event => {
    if (outside && event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => dialog.remove());
  dialog.showModal();
  return dialog;
}

function message(title, text) {
  return openDialog(title, `<p class="dialog-copy">${escapeHTML(text)}</p>
    ${button('OK', 'close', 'primary wide')}`);
}

function confirmation(title, text, confirmed, label = 'Confirm') {
  const dialog = openDialog(title, `<p class="dialog-copy">${escapeHTML(text)}</p>
    <div class="dialog-actions">${button('Cancel', 'close', 'secondary')}
    <button type="button" class="primary confirm-action">${escapeHTML(label)}</button></div>`);
  dialog.querySelector('.confirm-action').addEventListener('click', () => {
    dialog.close();
    confirmed();
  });
}

function filters() {
  const dialog = openDialog('Filter menu', `<p class="dialog-copy">Select a food category</p>
    <form class="filter-form">
      <div class="filter-options">${categories.map(category => `<label>
        <input type="radio" name="category" value="${category}" ${state.category === category ? 'checked' : ''}>
        <span>${category}</span></label>`).join('')}</div>
      <div class="dialog-actions">${button('Cancel', 'close', 'secondary')}
        <button class="primary" type="submit">Apply</button></div>
    </form>`);
  dialog.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    setCategory(new FormData(event.currentTarget).get('category'));
    dialog.close();

  });
}

function photoPreview(file, name, circle = false) {
  openDialog('', `<img alt="${escapeHTML(name)}" src="${escapeHTML(file)}">`,
    `photo-preview ${circle ? 'round-preview' : ''}`);
}

function quantityPicker(id) {
  const dish = dishesById.get(id);
  const current = state.cart.get(id);
  let quantity = current?.quantity || 1;
  const min = current ? 0 : 1;
  const dialog = openDialog(dish.name, `<div class="quantity-photo">${photoButton(dish)}</div>
    <p class="quantity-label">Quantity</p>
    <div class="stepper">
      <button type="button" class="secondary" aria-label="Decrease quantity">−</button>
      <output aria-live="polite">${quantity}</output>
      <button type="button" class="secondary" aria-label="Increase quantity">+</button>
    </div>
    <div class="dialog-actions">${button('Cancel', 'close', 'secondary')}
      <button type="button" class="primary save-quantity">Save</button></div>`);
  const [minus, plus] = dialog.querySelectorAll('.stepper button');
  const count = dialog.querySelector('output');
  const update = delta => {
    quantity = Math.max(min, Math.min(99, quantity + delta));
    count.value = quantity;
    minus.disabled = quantity <= min;
    plus.disabled = quantity >= 99;
  };
  minus.addEventListener('click', () => update(-1));
  plus.addEventListener('click', () => update(1));
  update(0);
  dialog.querySelector('.save-quantity').addEventListener('click', () => {
    if (quantity === 0) state.cart.delete(id);
    else state.cart.set(id, {dish, quantity, selected: current?.selected ?? true});
    dialog.close();
    if (state.page === 'cart') render(true);
    else {
      for (const badge of screen.querySelectorAll(`[data-action="quantity"][data-value="${id}"] img`)) {
        badge.src = imageRoot + (quantity ? 'saved_mark.png' : 'add_mark.png');
      }
    }
  });
}

function bindSlider() {
  const track = screen.querySelector('.checkout-slider');
  const thumb = track?.querySelector('.slider-thumb');
  if (!thumb || thumb.disabled) return;

  let pointer = null;
  let startX = 0;
  let progress = 0;
  const travel = () => track.clientWidth - thumb.offsetWidth - thumb.offsetLeft * 2;
  const setProgress = value => {
    progress = Math.max(0, Math.min(1, value));
    thumb.style.transform = `translateX(${progress * travel()}px)`;
    track.style.setProperty('--progress', progress);
  };
  const finish = () => {
    if (track.classList.contains('complete')) return;
    thumb.classList.remove('dragging');
    track.classList.add('complete');
    setProgress(1);
    thumb.innerHTML = '<span>Redirecting</span><b aria-hidden="true">✓</b>';
    setTimeout(() => {
      if (track.isConnected && state.page === 'cart' && total() > 0) navigate('payment');
    }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 390);
  };

  thumb.addEventListener('pointerdown', event => {
    if (event.button !== 0 || track.classList.contains('complete')) return;
    pointer = event.pointerId;
    startX = event.clientX;
    thumb.setPointerCapture(pointer);
    thumb.classList.add('dragging');
  });
  thumb.addEventListener('pointermove', event => {
    if (pointer === event.pointerId) setProgress((event.clientX - startX) / Math.max(1, travel()));
  });
  thumb.addEventListener('pointerup', event => {
    if (pointer !== event.pointerId) return;
    setProgress((event.clientX - startX) / Math.max(1, travel()));
    pointer = null;
    if (progress >= .82) finish();
    else {
      thumb.classList.remove('dragging');
      setProgress(0);
    }
  });
  thumb.addEventListener('pointercancel', () => {
    pointer = null;
    thumb.classList.remove('dragging');
    setProgress(0);
  });
  thumb.addEventListener('click', event => {
    if (event.detail === 0) finish();
  });
}

function bindDeliveryHandle(handle) {
  let down = 0;
  handle.addEventListener('pointerdown', event => {
    down = event.clientY;
    handle.setPointerCapture(event.pointerId);
  });
  handle.addEventListener('pointerup', event => {
    if (down - event.clientY > 22) delivery();
  });
}

function receipt(order) {
  const lines = order.lines.map(({dish, quantity}) =>
    `<li><span><span>${quantity} × ${dish.name}</span><small>${venuesById.get(dish.venue).name}</small></span>
      <strong>${price(dish.cents * quantity)}</strong></li>`).join('');
  openDialog('Receipt', `<ul class="receipt-list">${lines}</ul>
    <p class="receipt-address">Delivery to<br><strong>${escapeHTML(order.address)}</strong></p>
    <p class="receipt-total">Total <strong>${price(order.total)}</strong></p>${button('Done', 'close', 'primary wide')}`);
}

function delivery() {
  if (app.querySelector('dialog.delivery-overlay[open]')) return;
  const order = state.orders.at(-1);
  if (!order) return;
  const dialog = openDialog('Delivery details', `<div class="sheet-grip" aria-hidden="true"></div>
    <div class="arrival"><div><p>ARRIVING IN</p><strong>10–15 min</strong></div>
      <span class="delivery-status"><i></i>On the way</span></div>
    <div class="delivery-address"><span>↗</span><div><strong>${escapeHTML(order.address)}</strong>
      <small>Leave at the door · Demo delivery</small></div></div>
    <div class="delivery-receipt"><span>Order #${order.id}</span>
      ${button('View receipt', 'receipt', 'link', order.id)}</div>
    <div class="courier">${image('courier_avatar.jpg', '', 'courier-avatar')}
      <div><strong>Jordon Keith</strong><small>Courier · 4.9 rating</small><small>Near Akaki Tsereteli Avenue</small></div>
      ${imageButton('courier_call.png', 'Contact demo courier', 'call', 'courier-call')}</div>
    <p class="delivery-steps">Confirmed&nbsp; · &nbsp;Picked up&nbsp; · &nbsp;On the way</p>`, 'delivery-overlay');
  const grip = dialog.querySelector('.sheet-grip');
  const body = dialog.querySelector('.dialog-body');
  let pointer = null;
  let down = 0;
  grip.addEventListener('pointerdown', event => {
    pointer = event.pointerId;
    down = event.clientY;
    grip.setPointerCapture(pointer);
  });
  grip.addEventListener('pointermove', event => {
    if (pointer === event.pointerId) body.style.transform = `translateY(${Math.max(0, event.clientY - down)}px)`;
  });
  const reset = () => {
    pointer = null;
    body.style.removeProperty('transform');
  };
  grip.addEventListener('pointercancel', reset);
  grip.addEventListener('pointerup', event => {
    if (event.clientY - down > 48) dialog.close();
    reset();
  });
}

function orderHistory() {
  openDialog('Order history', `<div class="order-history">
    ${state.orders.length ? [...state.orders].reverse().map(order => `<button type="button" class="history-item"
      data-action="receipt" data-value="${order.id}" aria-label="View order #${order.id}">
      <span><strong>Order #${order.id}</strong><b>${price(order.total)}</b></span>
      <small>Items: ${order.lines.reduce((count, line) => count + line.quantity, 0)}</small>
      <small>${escapeHTML(order.address)}</small></button>`).join('') : '<p class="dialog-copy">You have no demo orders yet.</p>'}
    </div>${button('Done', 'close', 'primary wide')}`);
}

function nickname() {
  const dialog = openDialog('Enter your new nickname:', `<form class="nickname-form">
    <input name="name" aria-label="New nickname" value="${escapeHTML(state.name)}" maxlength="36" required>
    <div class="dialog-actions">${button('Cancel', 'close', 'secondary')}
    <button type="submit" class="primary">Save</button></div></form>`, 'nickname-overlay');
  dialog.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    const name = new FormData(event.currentTarget).get('name').trim();
    if (!name) return;
    state.name = name;
    dialog.close();
    render(true);
    const saved = openDialog('Your nickname has been changed successfully!', '<span class="large-check">✓</span>', 'nickname-overlay');
    setTimeout(() => { if (saved.open) saved.close(); }, 1150);
  });
}

function profilePhoto() {
  const dialog = openDialog('Profile photo', `<p class="dialog-copy">Choose a photo from this device</p>
    <label class="primary wide photo-picker">Choose photo<input type="file" accept="image/*"></label>
    ${button('View photo', 'avatar-photo', 'secondary wide')}
    ${button('Cancel', 'close', 'secondary wide')}`);
  dialog.querySelector('input').addEventListener('change', event => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 12 * 1024 * 1024) {
      message('Profile photo', 'Choose an image under 12 MB.');
      return;
    }
    const url = URL.createObjectURL(file);
    const preview = new Image();
    preview.onload = () => {
      if (!dialog.open) {
        URL.revokeObjectURL(url);
        return;
      }
      if (state.avatar) URL.revokeObjectURL(state.avatar);
      state.avatar = url;
      dialog.close();
      render(true);
    };
    preview.onerror = () => {
      URL.revokeObjectURL(url);
      if (dialog.open) message('Profile photo', 'This image could not be opened.');
    };
    preview.src = url;
  });
}

function avatarPhoto() {
  photoPreview(state.avatar || imageRoot + 'avatar.png', 'Profile photo', true);
}

function bindAvatar() {
  const avatar = screen.querySelector('.avatar');
  let timer;
  const cancel = () => clearTimeout(timer);
  avatar.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    avatar.dataset.longPress = 'false';
    timer = setTimeout(() => {
      avatar.dataset.longPress = 'true';
      avatarPhoto();
    }, 520);
  });
  for (const name of ['pointerup', 'pointercancel', 'pointerleave']) avatar.addEventListener(name, cancel);
  avatar.addEventListener('contextmenu', event => event.preventDefault());
  avatar.addEventListener('keydown', () => { avatar.dataset.longPress = 'false'; });
}

function confirmPayment() {
  const address = state.address.trim();
  const lines = selectedLines();
  if (!address || !lines.length) return;
  confirmation('Confirm demo payment', `${address}\n${price(total(lines))} · No money will be charged.`, () => {
    for (const line of lines) state.cart.delete(line.dish.id);
    state.orders.push({id: 88492 + state.orders.length, lines, total: total(lines), address});
    navigate('success');
  });
}

const actions = {
  go: value => navigate(value),
  venue: value => { state.venue = value; navigate('restaurant'); },
  filters,
  category: setCategory,
  clear: () => {
    state.query = '';
    document.querySelector('#search').value = '';
    setCategory('All');
  },
  quantity: quantityPicker,
  toggle: value => {
    const line = state.cart.get(value);
    if (line) line.selected = !line.selected;
    render(true);
  },
  close: (value, element) => element.closest('dialog')?.close(),
  'dish-photo': value => {
    const dish = dishesById.get(value);
    photoPreview(imageRoot + dish.photo, dish.name);
  },
  password: (value, element) => {
    const input = document.getElementById(value);
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    element.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    element.querySelector('img').src = imageRoot + (show ? 'eye_crossed.png' : 'eye_open.png');
  },
  provider: value => confirmation(value, 'Continue with a local demo account.', () => navigate('start'), 'Continue'),
  forgot: () => message('Forgot your password?', 'This offline demo does not send reset emails.'),
  'new-card': () => message('Add new card', 'This offline demo already has a sample card. No card details are collected.'),
  refresh: () => message('My order', 'No ongoing orders'),
  delivery,
  zoom: value => screen.querySelector('canvas')?.dispatchEvent(new CustomEvent('map-zoom', {detail: Number(value)})),
  receipt: value => {
    const order = state.orders.find(order => order.id === Number(value));
    if (order) receipt(order);
  },
  call: () => message('Courier', 'This contact is part of the offline demo.'),
  nickname,
  history: orderHistory,
  addresses: () => message('Addresses', 'There are no saved addresses in this demo.'),
  favorites: () => message('Favorites', 'You have no saved favorites yet.'),
  promocodes: () => message('My promocodes', 'There are no active promo codes in this demo.'),
  avatar: (value, element) => { if (element.dataset.longPress !== 'true') profilePhoto(); },
  'avatar-photo': avatarPhoto,
  signout: () => confirmation('Sign out?', 'Your demo cart and orders will be cleared.', () => {
    if (state.avatar) URL.revokeObjectURL(state.avatar);
    Object.assign(state, {
      venue: 'ori', query: '', category: 'All', cart: new Map(), cartBack: 'home',
      address: '', orders: [], name: 'George Giorgadze', avatar: '',
    });
    navigate('login');
  }, 'Sign out'),
};

app.addEventListener('click', event => {
  const element = event.target.closest('[data-action]');
  if (element) actions[element.dataset.action]?.(element.dataset.value, element);
});

screen.addEventListener('input', event => {
  if (event.target.id === 'search') {
    state.query = event.target.value;
    updateHome();
  } else if (event.target.id === 'address') {
    state.address = event.target.value;
    event.target.setCustomValidity('');
  } else if (event.target.id === 'confirm' || event.target.id === 'password') {
    document.querySelector('#confirm')?.setCustomValidity('');
  }
});

screen.addEventListener('submit', event => {
  event.preventDefault();
  if (event.target.id === 'auth-form') {
    const confirmationField = event.target.elements.confirm;
    if (confirmationField && confirmationField.value !== event.target.elements.password.value) {
      confirmationField.setCustomValidity('Passwords must match.');
      confirmationField.reportValidity();
      return;
    }
    navigate('start');
  } else if (event.target.id === 'payment-form') {
    const input = event.target.elements.address;
    state.address = input.value;
    if (!input.value.trim()) {
      input.setCustomValidity('Enter a delivery address.');
      input.reportValidity();
      return;
    }
    confirmPayment();
  }
});

setTimeout(() => navigate(params.get('start') === 'home' ? 'home' : 'welcome'), 650);
