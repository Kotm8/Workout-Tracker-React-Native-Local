import DropdownComponent from "@/components/DropdownComponent";
import WorkoutCard from "@/components/WorkoutCard";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Modal, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Workouts } from "../interfaces/interfaces";
import { loadWorkouts, saveWorkouts } from "../services/workoutStorage";
import "./globals.css";

export default function Index() {
	const router = useRouter();
	const [visible, setVisible] = useState(false);
	const {
		data: workoutData,
		loading: workoutsLoading,
		error: workoutsError,
		refetch: refetchWorkouts
	} = useFetch<Workouts>(loadWorkouts);
	const workoutOptions = [
		{ label: "Push", value: "push" },
		{ label: "Pull", value: "pull" },
		{ label: "Legs", value: "legs" },
	]; 	//TODO make dynamic 
	//TODO make self assigning
	const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
	const handleAddNewWorkout = async (workoutTypein: string) => {
		if (!workoutData) return;

		const newWorkout = {
			id: Date.now().toString(),
			date: new Date().toLocaleDateString('en-CA'),
			workoutType: workoutTypein,
			exercises: [],
			note: ""
		};

		const updatedWorkouts = {
			...workoutData,
			workoutList: [newWorkout, ...workoutData.workoutList]
		};

		await saveWorkouts(updatedWorkouts);

		await refetchWorkouts();

		router.push(`/workouts/${newWorkout.id}`);
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

	return (
		<View className="flex-1 bg-primary">
			<TouchableOpacity
				onPress={() => setVisible(true)}
				className="absolute bottom-10 left-5 right-5 bg-blue-500 p-4 rounded-lg items-center z-10"
			>
				<Text className="text-white font-bold text-lg">Start New Workout</Text>
			</TouchableOpacity>

			<Modal
				transparent
				animationType="fade"
				visible={visible}
				onRequestClose={() => setVisible(false)}
				statusBarTranslucent={Platform.OS === "android"}
			>
				<TouchableOpacity
					className="flex-1 bg-black/30 items-center justify-center"
					onPress={() => { }}
					activeOpacity={1}
				>
					<View className="bg-white rounded-xl p-3 shadow-lg w-[75%]">
						<Text>Start a new workout</Text>

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
							className="bg-blue-500 p-4 rounded-lg items-center mt-4"
						>
							<Text className="text-white font-bold text-lg">LETS GO!</Text>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</Modal>

			<>

				<ScrollView className="flex-1 px-5 top-16" showsVerticalScrollIndicator={false} contentContainerStyle={{
					minHeight: "100%",
					paddingBottom: 10
				}}>
					<Text className="text-white font-bold text-4xl">Workouts</Text>
					{workoutsLoading ? (
						<ActivityIndicator
							size="large"
							color="#0000ff"
							className="mt-10 self-center"
						/>
					) : workoutsError ? (
						<Text className="text-red-500 px-5 my-3">
							Error: {workoutsError?.message}
						</Text>
					) :
						<View className="flex-1 mt-5">

							<FlatList
								data={workoutData?.workoutList}
								renderItem={({ item }) => (
									<WorkoutCard
										workout={item}
										onDelete={handleDeleteWorkout}
									/>
								)}

								keyExtractor={(item) => item.id.toString()}
								className="mt-2 pb-32"

								scrollEnabled={false}
							/>
						</View>
					}
				</ScrollView>
			</>

		</View>
	);
}
