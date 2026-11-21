export const categories = ['All', 'Pizza', 'Shawarma', 'Khinkali', 'Sushi', 'Khachapuri', 'Drinks'];

export const categoryPhotos = {
  Pizza: 'category_pizza.jpg',
  Shawarma: 'category_shawarma.jpg',
  Khinkali: 'category_khinkali.jpg',
  Sushi: 'food_sushi.jpg',
  Khachapuri: 'food_khachapuri.png',
  Drinks: 'drink_lemonade.png',
};

const drinks = [
  ['nabeghlavi', 'Nabeghlavi', 'Sparkling mineral water', 'Drinks', 250, 'drink_nabeghlavi.png', '4.9'],
  ['cola', 'Coca-Cola', 'Soft drink', 'Drinks', 200, 'drink_cola.png', '4.8'],
  ['lemonade', 'Lemonade', 'Lemon soft drink', 'Drinks', 245, 'drink_lemonade.png', '4.7'],
  ['xl', 'XL', 'Energy drink', 'Drinks', 300, 'drink_xl.png', '4.5'],
];

function venue(id, name, district, rating, photo, menu, beverages = drinks.slice(0, 2)) {
  const convert = ([key, name, description, category, cents, photo, rating]) =>
    ({ id: `${id}-${key}`, venue: id, name, description, category, cents, photo, rating });
  return { id, name, district, rating, photo, menu: menu.map(convert), drinks: beverages.map(convert) };
}

export const venues = [
  venue('ori', 'Restaurant Ori Tona', 'Tbilisi', '4.8', 'restaurant.png', [
    ['acharuli', 'Acharuli Khachapuri', 'Acharuli Khachapuri', 'Khachapuri', 726, 'food_khachapuri.png', '4.5'],
    ['khinkali', 'Khinkali Kalakuri', 'Khinkali kalakuri', 'Khinkali', 125, 'food_khinkali.png', '4.8'],
    ['combo', 'Beef Combo', 'Beef and grilled vegetables', 'Combo', 1620, 'food_combo.png', '4.7'],
    ['pizza', 'Best Pizza', 'Hot beef pizza', 'Pizza', 986, 'category_pizza.jpg', '4.7'],
    ['pasta', 'Pasta', 'Pasta with chili sauce', 'Pasta', 1184, 'cart_pasta.png', '4.5'],
    ['shawarma', 'Shawarma', 'Chicken shawarma', 'Shawarma', 626, 'category_shawarma.jpg', '4.8'],
    ['kebab', 'Kebab', 'Grilled kebab', 'Kebab', 1050, 'food_kebab.png', '4.6'],
  ], drinks),
  venue('mtatsminda', 'Mtatsminda Kitchen', 'Mtatsminda', '4.9', 'venue_mtatsminda.jpg', [
    ['khinkali', 'Mountain Khinkali', 'Pork and beef dumplings', 'Khinkali', 150, 'food_mountain_khinkali.jpg', '4.9'],
    ['imeruli', 'Imeruli Khachapuri', 'Classic Georgian cheese bread', 'Khachapuri', 640, 'food_imeruli.jpg', '4.8'],
    ['kebab', 'Grilled Kebab', 'Kebab with herbs and onion', 'Kebab', 1150, 'food_kebab.png', '4.7'],
  ]),
  venue('vera', 'Vera Pizza & Grill', 'Vera', '4.7', 'venue_vera.jpg', [
    ['pizza', 'Pepperoni Pizza', 'Wood-fired pizza with pepperoni', 'Pizza', 1120, 'category_pizza.jpg', '4.8'],
    ['shawarma', 'Spicy Shawarma', 'Chicken wrap with spicy sauce', 'Shawarma', 710, 'category_shawarma.jpg', '4.7'],
    ['khinkali', 'Urban Khinkali', 'Dumplings with meat and herbs', 'Khinkali', 145, 'food_khinkali.png', '4.7'],
  ]),
  venue('saburtalo', 'Saburtalo Sushi & Kitchen', 'Saburtalo', '4.8', 'venue_saburtalo.jpg', [
    ['salmon', 'Salmon Roll', 'Salmon, rice and avocado', 'Sushi', 1020, 'food_sushi.jpg', '4.9'],
    ['maki', 'Avocado Maki', 'Avocado, cucumber and rice', 'Sushi', 865, 'food_maki.jpg', '4.8'],
    ['shawarma', 'Chicken Shawarma', 'Chicken wrap with greens', 'Shawarma', 690, 'category_shawarma.jpg', '4.6'],
    ['pizza', 'House Pizza', 'Pepperoni and mozzarella', 'Pizza', 1050, 'category_pizza.jpg', '4.7'],
  ]),
];

export const venuesById = new Map(venues.map(item => [item.id, item]));
export const dishes = venues.flatMap(item => [...item.menu, ...item.drinks]);
export const dishesById = new Map(dishes.map(item => [item.id, item]));

export function matchingDishes(query, category) {
  const terms = query.trim().toLowerCase().split(/\s+/);
  const eligible = dishes.filter(dish => category === 'All' || dish.category === category);
  const text = dish => `${dish.name} ${dish.description} ${dish.category}`.toLowerCase();
  const matches = eligible.filter(dish => terms.every(term => text(dish).includes(term)));
  if (matches.length) return matches;
  return eligible.filter(dish => {
    const {name, district} = venuesById.get(dish.venue);
    const searchable = `${text(dish)} ${name} ${district}`.toLowerCase();
    return terms.every(term => searchable.includes(term));
  });
}

export const price = cents => `${(cents / 100).toFixed(2)}$`;
