import { colors } from '@/assets/colors';
import { Workout } from '@/interfaces/interfaces';
import { durationHHMMSS, timeHHMM } from '@/services/timeConverter';
import { Link } from 'expo-router';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

const WorkoutCard = ({ workout, onDelete }: { workout: Workout, onDelete: (id: string) => void }) => {
	const { id, date, workoutType, workoutEnded } = workout

	const handleLongPress = () => {
		Alert.alert(
			"Delete Workout",
			"Are you sure you want to delete this workout?",
			[
				{ text: "Cancel", style: "cancel" },
				{ text: "Delete", style: "destructive", onPress: () => onDelete(id) }
			]
		)
	}


	return (
		<Link href={`./workouts/${id}`} asChild>
			<TouchableOpacity
				className="w-full"
				onLongPress={handleLongPress}
				delayLongPress={600}
			>
				<View className="flex-row items-center gap-x-2 bg-secondary mt-5 rounded-lg">
					<View className="justify-center items-center rounded-l"
						style={{
							width: 100,
							height: 80,
							backgroundColor: colors.workout[workoutType as keyof typeof colors.workout] || colors.primary
						}}>
						<Text className='text-4xl text-white '
							style={{
								textShadowColor: 'rgba(0,0,0,0.9)',
								textShadowOffset: { width: 1, height: 1 },
								textShadowRadius: 1
							}}>
							{String(workoutType).charAt(0).toUpperCase() + String(workoutType).slice(1)}</Text>
					</View>
					{workoutEnded ?
						<View className="flex-col justify-center w-full">
							<View className="flex-row">
								<Text className="text-xl font-bold text-white" numberOfLines={1}>{date}</Text>
								<Text className="text-xl font-bold text-gray-300 ml-5" numberOfLines={1}>dur: {durationHHMMSS(id, workoutEnded)}</Text>
							</View>
							<Text className="text-xl text-gray-300 " numberOfLines={1}>{timeHHMM(id)} - {timeHHMM(workoutEnded)}</Text>
						</View>
						:
						<Text className="text-xl font-bold text-white " numberOfLines={1}>{date} </Text>
					}
				</View>
			</TouchableOpacity>
		</Link>
	)
}

export default WorkoutCard