import { useCallback, useEffect, useState } from "react";

type UseFetchState<T> = {
	data: T | null;
	isLoading: boolean;
	error: string | null;
};

type UseFetchOptions = {
	headers?: HeadersInit;
	enabled?: boolean;
};

export function useFetch<T>(
	url: string | null,
	options: UseFetchOptions = {},
) {
	const { headers, enabled = true } = options;
	const [state, setState] = useState<UseFetchState<T>>({
		data: null,
		isLoading: Boolean(url && enabled),
		error: null,
	});

	const fetchData = useCallback(async () => {
		if (!url || !enabled) {
			setState((prev) => ({ ...prev, isLoading: false }));
			return;
		}

		try {
			setState((prev) => ({ ...prev, isLoading: true, error: null }));

			const response = await fetch(url, { headers });

			if (!response.ok) {
				throw new Error(`Request failed with status ${response.status}`);
			}

			const payload = (await response.json()) as T;
			setState({ data: payload, isLoading: false, error: null });
		} catch (error) {
			setState({
				data: null,
				isLoading: false,
				error: error instanceof Error ? error.message : "Unknown request error",
			});
		}
	}, [enabled, headers, url]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return {
		...state,
		refetch: fetchData,
	};
}
