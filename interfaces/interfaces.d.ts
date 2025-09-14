export interface Workouts {
	workoutList: Workout[];
}

export interface Workout {
	id: string;
	date: string;
	workoutType: string;
	exercises: Exercise[];
	note?: string;
	workoutEnded?: string;
}

export interface Exercise {
	name: string;
	sets: ExerciseSet[];
	level: number;
	previousLevel?: number;
} 

export interface ExerciseSet {
	reps: number;
	weight: number;
}

