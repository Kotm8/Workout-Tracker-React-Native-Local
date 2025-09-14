import { colors } from '@/assets/colors';
import { Workout } from '@/interfaces/interfaces';
import { Link } from 'expo-router';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

const WorkoutCard = ({ workout, onDelete }: { workout: Workout, onDelete: (id: string) => void }) => {
	const { id, date, workoutType } = workout

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
							width: 120,
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
					<Text className="text-xl font-bold text-white mt-2" numberOfLines={1}>{date} </Text>

				</View>
			</TouchableOpacity>
		</Link>
	)
}

export default WorkoutCard