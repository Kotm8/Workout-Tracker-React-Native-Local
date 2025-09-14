import ExerciseCard from '@/components/ExerciseCard';
import { Workout } from '@/interfaces/interfaces';
import { useDebouncedCallback } from '@/services/useDebouncedCallback';
import useFetch from '@/services/useFetch';
import { loadWorkout, saveWorkout } from '@/services/workoutStorage';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../assets/colors';

const WorkoutDetail = () => {
	const { id } = useLocalSearchParams();

	const {
		data: workoutData,
		loading: workoutLoading,
		error: workoutError,
		refetch: refetchWorkout
	} = useFetch<Workout>(() => (loadWorkout(String(id))));

	const [workout, setWorkout] = useState<Workout | null>(null);

	useEffect(() => {
		if (workoutData) setWorkout(workoutData);
	}, [workoutData]);


	const handleAddNewExercise = async () => {
		if (!workout) return;

		const newExercise = {
			name: "new Exercise",
			sets: [{
				reps: 0,
				weight: 0
			}],
			level: 0,
		};

		setWorkout(prev => {
			if (!prev) return prev;
			const updatedWorkout = {
				...prev,
				exercises: [...prev.exercises, newExercise]
			};

			saveWorkout(updatedWorkout);
			return updatedWorkout;
		});
	};

	const handleEndWorkout = async () => {
		if (!workout) return;

		const updatedWorkout = {
			...workout,
			workoutEnded: Date.now().toString(),
		};

		setWorkout(updatedWorkout);

		await saveWorkout(updatedWorkout);
	}

	const debouncedSaveWorkout = useDebouncedCallback((updatedWorkout: Workout) => {
		saveWorkout(updatedWorkout);
	}, 500);

	return (
		<View className="flex-1 bg-primary p-5" >

			<Stack.Screen
				options={{
					title: workout?.workoutType || "Workout",
					headerStyle: { backgroundColor: colors.workout[workout?.workoutType as keyof typeof colors.workout] || colors.primary },
					headerTintColor: '#ffffff',
					headerRight: () => (
						<>
							{!workout?.workoutEnded ?
								<TouchableOpacity onPress={handleEndWorkout}>
									<Text className='text-white text-xl font-bold'>End Workout</Text>
								</TouchableOpacity> : null
							}
						</>
					),
				}}
			/>
			
			<Text className="text-white text-2xl font-bold mt-5">Exercises</Text>
			<>
				{workoutLoading ? (
					<ActivityIndicator
						size="large"
						color="#0000ff"
						className="mt-10 self-center"
					/>
				) : workoutError ? (
					<Text className="text-red-500 px-5 my-3">
						Error: {workoutError?.message}
					</Text>
				) :
					<FlatList
						data={workout?.exercises}
						renderItem={({ item, index }) => (
							<ExerciseCard
								exercise={item}
								workoutType={workout?.workoutType}
								onChange={(updatedExercise) => {
									setWorkout(prev => {
										if (!prev) return prev;
										const updatedExercises = [...prev.exercises];
										updatedExercises[index] = updatedExercise;
										const updatedWorkout = { ...prev, exercises: updatedExercises };
										debouncedSaveWorkout(updatedWorkout);
										return updatedWorkout;
									});
								}}
							/>
						)}
						keyExtractor={(item, index) => `${item.name}-${index}`}
						ListEmptyComponent={
							<Text className="text-gray-400">No exercises recorded yet.</Text>
						}
						ListFooterComponent={
							(workout?.exercises?.length ?? 0) < 15 ? (
								<TouchableOpacity
									onPress={handleAddNewExercise}
									className="bg-blue-500 p-4 rounded-lg items-center mt-5"
								>
									<Text className="text-white font-bold text-lg">Start New Workout</Text>
								</TouchableOpacity>
							) : null
						}
					/>
				}
			</>
		</View>
	);
};

export default WorkoutDetail;