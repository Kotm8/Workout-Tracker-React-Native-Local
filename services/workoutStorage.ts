import { File, Paths } from "expo-file-system/next";
import * as Sharing from "expo-sharing";
import { Workout, Workouts } from "../interfaces/interfaces";


const file = new File(Paths.document, "workouts.json");

async function ensureFile() {
	await file.info();
	if (!file.exists) {
		await file.write(JSON.stringify({ workoutList: [] }));
	}
}
export async function loadWorkouts(): Promise<Workouts> {
	try {
		await ensureFile();
		const text = await file.text();

		if (!text) return { workoutList: [] };

		const parsed = JSON.parse(text);

		return parsed as Workouts;

	} catch (err) {
		console.log("loadWorkouts error:", err);
		return { workoutList: [] };
	}
}

export async function loadWorkout(id: string): Promise<Workout> {
	try {
		if (!id) throw new Error("Invalid Workout ID.");
		const data = await loadWorkouts();
		const found = data.workoutList.find(w => String(w.id) === String(id));
		return (
			found ?? {
				id: "0",
				date: "not found",
				workoutType: "unknown",
				exercises: [],
				note: "not found",
				color: "#FFFFFF",
			}
		);
	} catch {
		return {
			id: "-1",
			date: "error",
			workoutType: "error",
			exercises: [],
			note: "error",
			color: "#FFFFFF",
		};
	}
}

export async function saveWorkouts(workouts: Workouts): Promise<void> {
	await file.write(JSON.stringify(workouts, null, 2));
}


export async function saveWorkout(workout: Workout): Promise<void> {
	const data = await loadWorkouts();
	const idx = data.workoutList.findIndex(w => String(w.id) === String(workout.id));
	if (idx === -1) throw new Error(`Workout with id ${workout.id} not found`);
	data.workoutList[idx] = workout;
	await saveWorkouts(data);
}
let isSharing = false;
export async function exportWorkoutsJson() {
	if (isSharing) return false;
	isSharing = true;

	try {
		await ensureFile();

		const available = await Sharing.isAvailableAsync();
		if (!available) {
			console.log("Sharing not available");
			return false;
		}

		await Sharing.shareAsync(file.uri);
		return true;

	} catch (err) {
		console.log("Share error:", err);
		return false;

	} finally {
		isSharing = false;
	}
}