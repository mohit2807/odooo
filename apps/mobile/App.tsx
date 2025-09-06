import 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './src/components/auth/auth-provider';
import { Navigation } from './src/navigation';
import { useState } from 'react';

export default function App() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Navigation />
        <StatusBar style="auto" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
