export const timeHHMM = (time: string | number) => {
	const date = new Date(Number(time));
	const hours = date.getHours();
	const minutes = date.getMinutes();
	return `${hours}:${minutes.toString().padStart(2, "0")}`;
};

export const durationHHMM = (start: string | number, end: string | number) => {
	const diffMs = Number(end) - Number(start);
	const hours = Math.floor(diffMs / (1000 * 60 * 60));
	const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
	return `${hours}:${minutes.toString().padStart(2, "0")}`;
};

export const durationHHMMSS = (start: string | number, end: string | number) => {
	const diffMs = Number(end) - Number(start);
	const hours = Math.floor(diffMs / (1000 * 60 * 60));
	const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
	return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};