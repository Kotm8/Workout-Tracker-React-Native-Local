import SpinningPlusButton from "@/components/ui/common/SpinningPlusButton";
import DropdownComponent from "@/components/ui/index/DropdownComponent";
import WorkoutCard from "@/components/ui/index/WorkoutCard";
import { Colors } from "@/constants/theme";
import useFetch from "@/services/useFetch";
import { loadSettings, type WorkoutOption } from "@/services/workoutsOptions";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Exercise, Workouts } from "../../interfaces/interfaces";
import { loadWorkouts, saveWorkouts } from "../../services/workoutStorage";


const colorScheme = 'light'

export default function Index() {
	const router = useRouter();
	const isFocused = useIsFocused();
	const [letRefresh, setLetRefresh] = useState(true);
	const [visible, setVisible] = useState(false);
	const {
		data: workoutData,
		loading: workoutsLoading,
		error: workoutsError,
		refetch: refetchWorkouts
	} = useFetch<Workouts>(loadWorkouts);

	useEffect(() => {
		if (isFocused && letRefresh) {
			refetchWorkouts();
			setLetRefresh(false);
		}
		(async () => {
			const settings = await loadSettings();
			setWorkoutOptions(settings.workoutOptions);
		})();
		if (visible) {
			const suggestedWorkout = getMostLikelyWorkout();
			setSelectedWorkout(suggestedWorkout?.value || null);
		}
	}, [visible, isFocused]);

	const [workoutOptions, setWorkoutOptions] = useState<WorkoutOption[]>([]);

	const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);

	const getMostLikelyWorkout = () => {
		try {
			if (!workoutData?.workoutList || workoutOptions.length === 0) {
				return workoutOptions[0];
			}

			const N = workoutOptions.length;

			const recent = workoutData.workoutList
				.slice(0, N)
				.map(w => w.workoutType)
				.filter(Boolean);

			const freq: Record<string, number> = {};
			for (const opt of workoutOptions) {
				freq[opt.value] = 0;
			}

			for (const type of recent) {
				if (freq[type] !== undefined) {
					freq[type] += 1;
				}
			}

			const sorted = workoutOptions
				.slice()
				.sort((a, b) => freq[a.value] - freq[b.value]);

			return sorted[0] ?? workoutOptions[0];
		} catch {
			return workoutOptions[0];
		}
	};


	const getLastWorkoutWithType = (workoutTypein: string) => {
		const lastWorkout = workoutData?.workoutList.find(element => element.workoutType === workoutTypein)
		return lastWorkout
	}

	const changeLevelToPreviousLevel = (exercisesin: Exercise[]): Exercise[] => {
		return exercisesin.map(element => ({
			...element,
			previousLevel: element.level,
			level: 0
		}));
	}

	const handleAddNewWorkout = async (workoutTypein: string) => {

		if (!workoutData) return;
		const lastWorkout = getLastWorkoutWithType(workoutTypein);
		let newExercises: Exercise[];
		if (lastWorkout) {
			newExercises = changeLevelToPreviousLevel(lastWorkout.exercises);
		} else {
			newExercises = [];
		}


		const optionColor = workoutOptions.find(o => o.value === workoutTypein)?.color ?? "#CCCCCC";

		const newWorkout = {
			id: Date.now().toString(),
			date: new Date().toLocaleDateString('en-CA'),
			workoutType: workoutTypein,
			exercises: [],
			lastExercises: newExercises,
			note: "",
			color: optionColor
		};

		const updatedWorkouts = {
			...workoutData,
			workoutList: [newWorkout, ...workoutData.workoutList]
		};

		await saveWorkouts(updatedWorkouts);

		await refetchWorkouts();
		setLetRefresh(true);
		router.push({
			pathname: "/workouts/[id]",
			params: {
				id: newWorkout.id,
				themeColor: optionColor,
				workoutEnded: "0"
			}
		});
	};

	const handleDeleteWorkout = async (id: string) => {
		if (!workoutData) return;

		const updatedWorkouts = {
			...workoutData,
			workoutList: workoutData.workoutList.filter(workout => workout.id !== id),
		};

		await saveWorkouts(updatedWorkouts);
		await refetchWorkouts();
	};

	const handleWorkoutTypeChange = async (id: string) => {
		if (!workoutData) return;

		const updatedWorkouts = workoutData.workoutList.map(workout => {
			if (workout.id !== id) return workout;

			const currentIndex = workoutOptions.findIndex(opt => opt.value === workout.workoutType);
			const nextIndex = (currentIndex + 1) % workoutOptions.length;

			return {
				...workout,
				workoutType: workoutOptions[nextIndex].value
			};
		});

		await saveWorkouts({ ...workoutData, workoutList: updatedWorkouts });
		await refetchWorkouts();
	};


	return (
		<View style={styles.container}>
			<SpinningPlusButton style={styles.newWorkoutButton} onPress={() => setVisible(true)} />
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
							color: Colors[colorScheme].text,
							marginBottom: 10
						}}>
							Start a new workout
						</Text>

						<DropdownComponent
							data={workoutOptions}
							placeholderString="Workout type"
							value={selectedWorkout}
							onChange={setSelectedWorkout}
						/>

						<TouchableOpacity
							onPress={() => {
								if (selectedWorkout) {
									handleAddNewWorkout(selectedWorkout);
									setVisible(false);
									setSelectedWorkout(null);
								}
							}}
							style={{
								backgroundColor: Colors[colorScheme].tint,
								padding: 14,
								borderRadius: 12,
								alignItems: "center",
								marginTop: 16
							}}
						>
							<Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
								LETS GO!
							</Text>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</Modal>

			<>

				<ScrollView
					style={styles.workoutScrollView}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{
						minHeight: "100%",
						paddingBottom: 10
					}}>
					{workoutsLoading ? (
						//<ActivityIndicator
						//	size="large"
						//	color="#0000ff"
						//	className="mt-10 self-center"
						///>
						<></>
					) : workoutsError ? (
						//<Text className="text-red-500 px-5 my-3">
						//	Error: {workoutsError?.message}
						//</Text>
						<></>
					) :
						<View style={styles.workoutView}>

							<FlatList
								data={workoutData?.workoutList}
								renderItem={({ item }) => (
									<WorkoutCard
										workout={item}
										onDelete={handleDeleteWorkout}
										onChangeType={handleWorkoutTypeChange}
										workoutOptions={workoutOptions}
										setLetRefresh={setLetRefresh}
									/>
								)}

								keyExtractor={(item) => item.id.toString()}
								style={styles.workoutFlatList}
								scrollEnabled={false}
							/>
						</View>
					}
				</ScrollView>
			</>

		</View>
	);
}
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
	bgContainer: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.3)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	workoutScrollView: {
		flex: 1,
		paddingLeft: 5,
		paddingRight: 5,
	},
	workoutView: {
		flex: 1,
	},
	workoutFlatList: {
		marginTop: 2,
		paddingBottom: 32,
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
});