import { useEffect, useState } from "react";

interface FetchResult<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export default function useFetch<T>(FetchFunction: () => Promise<T>): FetchResult<T> {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await FetchFunction();
            setData(result);
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

	useEffect(() => {
        fetchData();
    }, []);

	return { data, loading, error, refetch: fetchData };
}