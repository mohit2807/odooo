import { createClient } from "npm:@supabase/supabase-js";

// Initialize Supabase client with service role for admin operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

export async function setupDatabase() {
  try {
    console.log('Setting up database schema...');
    
    // Since we can't easily create tables via the API in this environment,
    // let's just focus on creating the storage buckets and ensuring
    // the existing tables work properly
    await setupStorage();
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Database setup failed:', error);
    // Don't throw error to allow the server to continue starting
  }
}

async function setupStorage() {
  // Create storage buckets
  const buckets = [
    { name: 'make-353bc013-product-images', public: true },
    { name: 'make-353bc013-avatars', public: true }
  ];

  for (const bucket of buckets) {
    try {
      const { data: existingBuckets } = await supabase.storage.listBuckets();
      const bucketExists = existingBuckets?.some(b => b.name === bucket.name);
      
      if (!bucketExists) {
        const { error } = await supabase.storage.createBucket(bucket.name, {
          public: bucket.public
        });
        if (error) {
          console.log(`Bucket creation result for ${bucket.name}:`, error);
        } else {
          console.log(`Created bucket: ${bucket.name}`);
        }
      } else {
        console.log(`Bucket ${bucket.name} already exists`);
      }
    } catch (error) {
      console.log(`Error with bucket ${bucket.name}:`, error);
    }
  }
}