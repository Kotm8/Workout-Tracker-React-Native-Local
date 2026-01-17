export interface Workouts {
	workoutList: Workout[];
}

export interface Workout {
	id: string;
	date: string;
	workoutType: string;
	exercises: Exercise[];
	lastExercises?: Exercise[];
	note?: string;
	workoutEnded?: string;
    color: string;
}

export interface Exercise {
	name: string;
	sets: ExerciseSet[];
	level: number;
	previousLevel?: number;
} 

export interface ExerciseSet {
	reps: string;
	weight: string;
}

