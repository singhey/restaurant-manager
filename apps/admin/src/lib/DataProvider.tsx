import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as ZenStackHooksProvider } from '@workspace/db/hooks/trpc';
import type { FetchFn } from '@workspace/db';
import { AuthProvider } from './AuthProvider';

// custom fetch function that adds a custom header
const myFetch: FetchFn = (url, options) => {
    options = options ?? {};
    options.headers = {
        ...options.headers,
        'x-my-custom-header': 'hello world',
    };
    options.credentials = 'include'
    return fetch(url, options);
};

const queryClient = new QueryClient();

function DataProvider({ children }: {children: React.ReactNode}): React.ReactNode {
    return (
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
            <ZenStackHooksProvider value={{ endpoint: 'http://localhost:3000/api/model', fetch: myFetch }}>
              {children}
            </ZenStackHooksProvider>
        </QueryClientProvider>
      </AuthProvider>
    );
}

export default DataProvider;