"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			networkMode: "always",
			staleTime: Number.POSITIVE_INFINITY,
			retry: false
		},
		mutations: {
			networkMode: "always"
		}
	}
});

export const ReactQueryProvider = ({
	children
}: {
	children: React.ReactNode;
}) => (
	<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
