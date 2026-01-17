import { IconSymbol } from '@/components/icon-symbol';
import SpinningPlusButton from '@/components/ui/common/SpinningPlusButton';
import ExerciseAddCard from '@/components/ui/id/ExerciseAddCard';
import ExerciseCard from '@/components/ui/id/ExerciseCard';
import { Colors } from '@/constants/theme';
import { ExerciseSet, Workout } from '@/interfaces/interfaces';
import useFetch from '@/services/useFetch';
import { loadWorkout, saveWorkout } from '@/services/workoutStorage';
import { useIsFocused } from '@react-navigation/native';
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const colorScheme = "light"
const WorkoutDetail = () => {
	const { id, themeColor, workoutEnded } = useLocalSearchParams();
	const navigation = useNavigation();
	const isFocused = useIsFocused();
	const [visible, setVisible] = useState(false);
	const headerColor = Array.isArray(themeColor) ? themeColor[0] : themeColor;
	const [ended, setEnded] = useState(workoutEnded === "1");
	const {
		data: workoutData,
		loading: workoutLoading,
		error: workoutError,
		refetch: refetchWorkout
	} = useFetch<Workout>(() => (loadWorkout(String(id))));

	const [workout, setWorkout] = useState<Workout | null>(null);
	const [now, setNow] = useState(Date.now());

	useEffect(() => {
		if (isFocused) {
			refetchWorkout();
		}
	}, [isFocused]);

	useEffect(() => {
		if (workoutData) setWorkout(workoutData);

		const interval = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(interval);
	}, [workoutData]);


	const handleAddNewExercise = async (exerciseNameIn: String) => {
		if (!workout) return;
		let exerciseName = exerciseNameIn?.trim() || "New Exercise";
		let exerciseSets: ExerciseSet[] = [
			{ reps: "", weight: "" }
		];
		let previousLevel = 0;
		if (exerciseNameIn) {
			const prevExercise = workout.lastExercises?.find(
				(e) => e.name.toLowerCase() === exerciseNameIn.toLowerCase()
			);

			if (prevExercise) {
				exerciseSets = prevExercise.sets.map((s) => ({
					reps: s.reps,
					weight: s.weight
				}));
				previousLevel = prevExercise?.previousLevel ?? 0;
			}
		}
		const newExercise = {
			name: exerciseName,
			sets: exerciseSets,
			previousLevel: previousLevel,
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
		setEnded(true);
		setWorkout(updatedWorkout);

		await saveWorkout(updatedWorkout);

	}

	return (
		<View style={styles.container} >
			{(workout?.exercises?.length ?? 0) < 15 ? (
				<SpinningPlusButton
					style={styles.newWorkoutButton}
					onPress={() => setVisible(true)}
				/>
			) : null}

			<Stack.Screen
				options={{
					title: "",
					headerStyle: { backgroundColor: headerColor },
					headerTintColor: '#ffffff',
					headerTitleAlign: 'center',
					headerLeft: () => (
						<>
							<TouchableOpacity onPress={async () => {
								if (workout) {
									await saveWorkout(workout);
								}
								navigation.goBack();
							}}>
								<IconSymbol name="arrow.left" color="black" size={24} />

							</TouchableOpacity>
						</>
					),
					//headerTitle: () => (
					//	<>
					//		{!workout?.workoutEnded ?
					//			<Text style={styles.durationText} numberOfLines={1}>
					//				dur: {durationHHMMSS(String(id), now.toString())}
					//			</Text> : null
					//		}
					//	</>
					//),
					headerRight: () => (
						!ended ? (
							<TouchableOpacity onPress={handleEndWorkout}>
								<Text style={styles.durationText}>End Workout</Text>
							</TouchableOpacity>
						) :
							<></>
					),
				}}
			/>
			<Modal
				transparent
				animationType="fade"
				visible={visible}
				onRequestClose={() => setVisible(false)}
				statusBarTranslucent={Platform.OS === "android"}
			>
				<TouchableOpacity
					style={styles.bgContainer}
					onPress={() => { }}
					activeOpacity={1}
				>
					<View style={styles.modalCard}>
						<Text style={{
							fontSize: 20,
							fontWeight: "600",
							color: Colors[colorScheme ?? 'light'].text,
							marginBottom: 10
						}}>
							Add a new Exercise
						</Text>
						<FlatList
							showsVerticalScrollIndicator={false}
							data={(() => {
								const alreadyAddedNames = new Set(
									workout?.exercises.map(e => e.name.toLowerCase()) ?? []
								);

								const lastNames = workout?.lastExercises ?? [];

								const filtered = lastNames.filter(
									e => !alreadyAddedNames.has(e.name.toLowerCase())
								);

								const unique = Array.from(new Map(filtered.map(e => [e.name.toLowerCase(), e])).values());

								return [{ name: "New Exercise" }, ...unique];
							})()}
							keyExtractor={(item, index) => index.toString()}
							renderItem={({ item }) => (
								<ExerciseAddCard
									name={item.name}
									onPress={() => {
										handleAddNewExercise(item.name);
										setVisible(false);
									}}
								/>
							)}
						/>

					</View>
				</TouchableOpacity>
			</Modal>

			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
				keyboardVerticalOffset={80}
			>
				{workoutLoading ? (
					<></>
					//<ActivityIndicator
					//	size="large"
					//	color="#0000ff"
					//	className="mt-10 self-center"
					///>
				) : workoutError ? (
					<></>
					//<Text className="text-red-500 px-5 my-3">
					//	Error: {workoutError?.message}
					//</Text>
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
										saveWorkout(updatedWorkout);
										return updatedWorkout;
									});
								}}
							/>
						)}
						keyExtractor={(item, index) => `${item.name}-${index}`}
						ListEmptyComponent={
							<></>
							//<Text className="text-gray-400">No exercises recorded yet.</Text>
						}

					/>
				}
			</KeyboardAvoidingView>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		//justifyContent: 'center',
		//alignItems: 'center',
	},
	newWorkoutButton: {
		position: 'absolute',
		bottom: 24,
		right: 24,
		zIndex: 100,
	},
	durationText: {
		fontSize: 20,
		color: Colors[colorScheme ?? 'light'].text,
		marginLeft: 20,
	},
	endWorkoutText: {
		color: Colors[colorScheme ?? 'light'].text,
		fontSize: 20,
	},
	bgContainer: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.3)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	modalCard: {
		width: "75%",
		borderRadius: 16,
		overflow: "hidden",
		backgroundColor: Colors[colorScheme ?? 'light'].secondary,
		borderWidth: 1,
		borderColor: Colors[colorScheme ?? 'light'].tint,
		padding: 16,
		elevation: 3,
	},

})
export default WorkoutDetail;

