import { createClient } from "npm:@supabase/supabase-js";
import * as kv from './kv_store.tsx';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // For now, let's use the KV store to demonstrate the application works
    // In a real implementation, we would seed the proper tables
    
    // Store some sample product data in the KV store for demo purposes
    const sampleProducts = [
      {
        id: '1',
        owner_id: 'demo-user',
        title: 'Kindle Paperwhite (11th Gen)',
        description: 'Gently used e-reader in excellent condition. Perfect for sustainable reading with long battery life and no ads. Includes original charger and case.',
        category: 'Electronics',
        price_cents: 450000,
        images: [],
        is_active: true,
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        owner_id: 'demo-user',
        title: 'Vintage Wooden Study Desk',
        description: 'Beautiful solid wood desk perfect for home office or student use. Some minor scratches that add character. Dimensions: 120cm x 60cm. Very sturdy construction.',
        category: 'Home & Living',
        price_cents: 350000,
        images: [],
        is_active: true,
        created_at: new Date().toISOString(),
      },
      {
        id: '3',
        owner_id: 'demo-user',
        title: 'English Willow Cricket Bat',
        description: 'Professional grade cricket bat made from premium English willow. Lightweight design with excellent pickup. Includes new grip and protective cover.',
        category: 'Sports & Outdoors',
        price_cents: 220000,
        images: [],
        is_active: true,
        created_at: new Date().toISOString(),
      }
    ];

    // Store products in KV store
    for (const product of sampleProducts) {
      await kv.set(`product:${product.id}`, JSON.stringify(product));
    }

    // Store a sample user profile
    const sampleProfile = {
      id: 'demo-user',
      username: 'eco_seller',
      avatar_url: null,
      created_at: new Date().toISOString(),
    };
    
    await kv.set('profile:demo-user', JSON.stringify(sampleProfile));
    
    console.log('Sample data stored in KV store for demo purposes');
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Database seeding failed:', error);
    // Don't throw to allow server to continue
  }
}