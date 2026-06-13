const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Catalogo prodotti Blue Arroyo (prezzi server-side, non manipolabili)
const PRODUCTS = {
  'cap': {
    name: 'Cappellino Blue Arroyo',
    price: 2500, // €25.00
    image: 'https://palazzobluearroyo.it/photos/ba_shop_cap.png'
  },
  'tshirt': {
    name: 'T-Shirt Blue Arroyo',
    price: 3000, // €30.00
    image: 'https://palazzobluearroyo.it/photos/ba_shop_tshirt.png'
  },
  'polo': {
    name: 'Polo Blue Arroyo',
    price: 3500, // €35.00
    image: 'https://palazzobluearroyo.it/photos/ba_shop_polo.png'
  },
  'hoodie': {
    name: 'Felpa Blue Arroyo',
    price: 5000, // €50.00
    image: 'https://palazzobluearroyo.it/photos/ba_shop_hoodie.png'
  },
  'jacket': {
    name: 'Giacca Softshell',
    price: 7000, // €70.00
    image: 'https://palazzobluearroyo.it/photos/ba_shop_jacket.png'
  }
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { items, customerName, customerEmail } = req.body;

    // Validazioni obbligatorie
    if (!items || items.length === 0)
      return res.status(400).json({ error: 'Il carrello è vuoto.' });
    if (!customerName || customerName.trim().length < 2)
      return res.status(400).json({ error: 'Il nome cliente è obbligatorio.' });
    if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim()))
      return res.status(400).json({ error: "L'indirizzo email non è valido." });

    const origin       = 'https://palazzobluearroyo.it';
    const nameTrimmed  = customerName.trim();
    const emailTrimmed = customerEmail.trim().toLowerCase();

    const line_items = items.map(item => {
      const product = PRODUCTS[item.id];
      if (!product) throw new Error(`Prodotto non trovato: ${item.id}`);

      const displayName = item.size && item.size !== 'unica'
        ? `${product.name} — Taglia ${item.size.toUpperCase()}`
        : product.name;

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: displayName,
            images: [product.image],
            description: 'Abbigliamento ufficiale Palazzo Blue Arroyo — Blue Arroyo srl, Firenze',
          },
          unit_amount: product.price,
        },
        quantity: item.quantity || 1,
      };
    });

    // Crea o aggiorna il cliente Stripe
    const existing = await stripe.customers.list({ email: emailTrimmed, limit: 1 });
    let customer;
    if (existing.data.length > 0) {
      customer = await stripe.customers.update(existing.data[0].id, { name: nameTrimmed });
    } else {
      customer = await stripe.customers.create({
        name: nameTrimmed,
        email: emailTrimmed,
        metadata: { source: 'palazzobluearroyo-shop', brand: 'Blue Arroyo srl' },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      payment_intent_data: {
        description: `Ordine abbigliamento Blue Arroyo — ${nameTrimmed}`,
        receipt_email: emailTrimmed,
        metadata: {
          customer_name:  nameTrimmed,
          customer_email: emailTrimmed,
          shop:           'palazzobluearroyo.it',
          brand:          'Blue Arroyo srl',
        },
      },
      shipping_address_collection: {
        allowed_countries: ['IT', 'FR', 'DE', 'ES', 'GB', 'CH', 'AT', 'BE', 'NL'],
      },
      metadata: {
        customer_name:  nameTrimmed,
        customer_email: emailTrimmed,
        items_count: String(items.reduce((t, i) => t + (i.quantity || 1), 0)),
      },
      success_url: `${origin}/shop-success.html?name=${encodeURIComponent(nameTrimmed)}`,
      cancel_url:  `${origin}/shop.html?cart=open`,
    });

    return res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    return res.status(500).json({ error: error.message });
  }
};
