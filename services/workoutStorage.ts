import * as FileSystem from "expo-file-system";
import { Workout, Workouts } from "../interfaces/interfaces";

const FILE_PATH = FileSystem.documentDirectory + "workouts.json";

export async function loadWorkouts(): Promise<Workouts> {
	try {
		const data = await FileSystem.readAsStringAsync(FILE_PATH);
		return data ? JSON.parse(data) : { workoutList: [] };
	} catch {
		return { workoutList: [] };
	}
};

export async function loadWorkout(id: string): Promise<Workout> {
	try {
		if (!id || typeof id !== 'string') {
			throw new Error("Invalid Workout ID.");
		}
		const workoutsData = await loadWorkouts();
		const foundWorkout = workoutsData?.workoutList.find(
			(workout) => workout.id.toString() === id
		);

		if (foundWorkout) {
			return foundWorkout
		}
		return {
			id: "0",
			date: "not found",
			workoutType: "unknown",
			exercises: [],
			note: "not found"
		};
	} catch (err: any) {
		return {
			id: "-1",
			date: "error",
			workoutType: "error",
			exercises: [],
			note: "error"
		};
	}
};

export async function saveWorkouts(workouts: Workouts): Promise<void> {
	const data = JSON.stringify(workouts, null, 2);
	await FileSystem.writeAsStringAsync(FILE_PATH, data);
};

export async function saveWorkout(workoutArgument: Workout): Promise<void> {
	const workoutsData = await loadWorkouts();
	const foundWorkoutIndex = workoutsData.workoutList.findIndex(
		(workout) => workout.id.toString() === workoutArgument.id.toString()
	);
	if (foundWorkoutIndex === -1) {
		throw new Error(`Workout with id ${workoutArgument.id} not found`);
	}
	workoutsData.workoutList[foundWorkoutIndex] = workoutArgument;
	await saveWorkouts(workoutsData);
};
