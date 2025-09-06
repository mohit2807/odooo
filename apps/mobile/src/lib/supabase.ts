import { createClient } from '@supabase/supabase-js';
import { Database } from '@ecofinds/types';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper functions
export const formatPrice = (cents: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(cents / 100);
};

export const getImagePlaceholder = () => {
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Cg fill='%236b7280'%3E%3Cpath d='M200 150c-27.614 0-50 22.386-50 50s22.386 50 50 50 50-22.386 50-50-22.386-50-50-50zm0 75c-13.807 0-25-11.193-25-25s11.193-25 25-25 25 11.193 25 25-11.193 25-25 25z'/%3E%3Cpath d='M300 100H100c-11.046 0-20 8.954-20 20v160c0 11.046 8.954 20 20 20h200c11.046 0 20-8.954 20-20V120c0-11.046-8.954-20-20-20zm-5 25v135l-45-45c-3.906-3.906-10.234-3.906-14.141 0L200 250.859l-25.859-25.859c-3.906-3.906-10.234-3.906-14.141 0L105 280V125h190z'/%3E%3C/g%3E%3C/svg%3E";
};
