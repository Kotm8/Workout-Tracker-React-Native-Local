import { useRef } from 'react';

export const useDebouncedCallback = (callback: (...args: any[]) => void, delay: number) => {
	const timeoutRef = useRef<number | null>(null);

	const debouncedFunction = (...args: any[]) => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			callback(...args);
		}, delay) as unknown as number;
	};

	return debouncedFunction;
};
