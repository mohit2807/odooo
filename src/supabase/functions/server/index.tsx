import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";
import { setupDatabase } from "./database-setup.tsx";
import { seedDatabase } from "./seed-data.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Setup database on server start
setupDatabase()
  .then(() => seedDatabase())
  .catch(console.error);

// Health check endpoint
app.get("/make-server-353bc013/health", (c) => {
  return c.json({ status: "ok" });
});

// Manual seed endpoint
app.post("/make-server-353bc013/seed", async (c) => {
  try {
    await seedDatabase();
    return c.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error('Manual seeding error:', error);
    return c.json({ error: 'Seeding failed' }, 500);
  }
});

// Auth endpoints
app.post("/make-server-353bc013/signup", async (c) => {
  try {
    const { email, password, username } = await c.req.json();
    
    // Create user
    const { data: userData, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username }
    });

    if (signUpError) {
      return c.json({ error: `Sign up error: ${signUpError.message}` }, 400);
    }

    try {
      // Try to create profile in database
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userData.user.id,
          username
        });

      if (profileError) {
        console.log('Profile creation in DB failed, storing in KV:', profileError);
        // Fallback to KV store
        await kv.set(`profile:${userData.user.id}`, JSON.stringify({
          id: userData.user.id,
          username,
          avatar_url: null,
          created_at: new Date().toISOString(),
        }));
      }

      // Try to create cart for user
      const { error: cartError } = await supabase
        .from('carts')
        .insert({
          user_id: userData.user.id
        });

      if (cartError) {
        console.log('Cart creation in DB failed, will handle in memory:', cartError);
      }
    } catch (dbError) {
      console.log('Database operations failed, user created but profile stored in KV:', dbError);
    }

    return c.json({ user: userData.user });
  } catch (error) {
    console.error('Signup endpoint error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Products endpoints
app.get("/make-server-353bc013/products", async (c) => {
  try {
    const query = c.req.query('query');
    const category = c.req.query('category');
    const sort = c.req.query('sort') || 'created_at_desc';
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '24');

    try {
      // Try to fetch from the database first
      let dbQuery = supabase
        .from('products')
        .select(`
          *,
          profiles:owner_id (username, avatar_url)
        `)
        .eq('is_active', true);

      // Add search filter
      if (query) {
        dbQuery = dbQuery.ilike('title', `%${query}%`);
      }

      // Add category filter
      if (category && category !== 'all') {
        dbQuery = dbQuery.eq('category', category);
      }

      // Add sorting
      switch (sort) {
        case 'price_asc':
          dbQuery = dbQuery.order('price_cents', { ascending: true });
          break;
        case 'price_desc':
          dbQuery = dbQuery.order('price_cents', { ascending: false });
          break;
        default:
          dbQuery = dbQuery.order('created_at', { ascending: false });
      }

      // Add pagination
      const offset = (page - 1) * limit;
      dbQuery = dbQuery.range(offset, offset + limit - 1);

      const { data, error } = await dbQuery;

      if (!error && data) {
        return c.json({ products: data });
      }
      
      console.log('Database query failed, falling back to demo data:', error);
    } catch (dbError) {
      console.log('Database not available, using demo data:', dbError);
    }

    // Fallback to demo data from KV store or hardcoded
    const demoProducts = [
      {
        id: '1',
        owner_id: 'demo-user',
        title: 'Kindle Paperwhite (11th Gen)',
        description: 'Gently used e-reader in excellent condition. Perfect for sustainable reading with long battery life and no ads.',
        category: 'Electronics',
        price_cents: 450000,
        images: [],
        is_active: true,
        created_at: new Date('2024-01-15').toISOString(),
        profiles: { username: 'eco_seller', avatar_url: null }
      },
      {
        id: '2',
        owner_id: 'demo-user',
        title: 'Vintage Wooden Study Desk',
        description: 'Beautiful solid wood desk perfect for home office or student use. Some minor scratches that add character.',
        category: 'Home & Living',
        price_cents: 350000,
        images: [],
        is_active: true,
        created_at: new Date('2024-01-14').toISOString(),
        profiles: { username: 'eco_seller', avatar_url: null }
      },
      {
        id: '3',
        owner_id: 'demo-user',
        title: 'English Willow Cricket Bat',
        description: 'Professional grade cricket bat made from premium English willow. Lightweight design with excellent pickup.',
        category: 'Sports & Outdoors',
        price_cents: 220000,
        images: [],
        is_active: true,
        created_at: new Date('2024-01-13').toISOString(),
        profiles: { username: 'eco_seller', avatar_url: null }
      },
      {
        id: '4',
        owner_id: 'demo-user',
        title: 'Vintage Leather Messenger Bag',
        description: 'Handcrafted genuine leather messenger bag with beautiful patina. Perfect for daily use or business.',
        category: 'Fashion & Apparel',
        price_cents: 180000,
        images: [],
        is_active: true,
        created_at: new Date('2024-01-12').toISOString(),
        profiles: { username: 'green_buyer', avatar_url: null }
      },
      {
        id: '5',
        owner_id: 'demo-user',
        title: 'Complete Harry Potter Book Set',
        description: 'All 7 books in excellent condition. Perfect for gifting or adding to your collection.',
        category: 'Books & Media',
        price_cents: 120000,
        images: [],
        is_active: true,
        created_at: new Date('2024-01-11').toISOString(),
        profiles: { username: 'green_buyer', avatar_url: null }
      }
    ];

    // Apply filters to demo data
    let filteredProducts = demoProducts;

    if (query) {
      filteredProducts = filteredProducts.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    // Apply sorting
    switch (sort) {
      case 'price_asc':
        filteredProducts.sort((a, b) => a.price_cents - b.price_cents);
        break;
      case 'price_desc':
        filteredProducts.sort((a, b) => b.price_cents - a.price_cents);
        break;
      default:
        filteredProducts.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    return c.json({ products: filteredProducts });
  } catch (error) {
    console.error('Products endpoint error:', error);
    return c.json({ error: 'Internal server error while fetching products' }, 500);
  }
});

// Cart endpoints (simplified for demo)
app.post("/make-server-353bc013/cart/items", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const { productId, quantity } = await c.req.json();

    // For demo purposes, we'll just acknowledge the add to cart
    // In a real app, we would store this in the database
    console.log(`User ${user.id} added product ${productId} (qty: ${quantity}) to cart`);

    return c.json({ success: true });
  } catch (error) {
    console.error('Add to cart error:', error);
    return c.json({ error: 'Internal server error while adding to cart' }, 500);
  }
});

// Checkout endpoint (simplified for demo)
app.post("/make-server-353bc013/checkout", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    // For demo purposes, simulate a successful checkout
    const orderId = `order-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const totalCents = 450000; // Demo amount
    
    // In a real app, we would:
    // 1. Get cart items from database
    // 2. Calculate total
    // 3. Create order and order items
    // 4. Clear cart
    // 5. Process payment
    
    const order = {
      id: orderId,
      user_id: user.id,
      status: 'PAID',
      total_cents: totalCents,
      created_at: new Date().toISOString()
    };

    // Store order in KV for demo
    await kv.set(`order:${orderId}`, JSON.stringify(order));

    return c.json({ order, totalCents });
  } catch (error) {
    console.error('Checkout error:', error);
    return c.json({ error: 'Internal server error during checkout' }, 500);
  }
});

Deno.serve(app.fetch);