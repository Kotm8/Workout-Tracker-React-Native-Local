import { Colors } from '@/constants/theme';
import { Workout } from '@/interfaces/interfaces';
import { durationHHMMSS, timeHHMM } from '@/services/timeConverter';
import { WorkoutOption } from '@/services/workoutsOptions';
import { Link } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const colorScheme = 'light'

const WorkoutCard = ({ workout, onDelete, onChangeType, workoutOptions, setLetRefresh }: { workout: Workout, onDelete: (id: string) => void, onChangeType: (id: string) => void, workoutOptions: WorkoutOption[], setLetRefresh: (id: boolean) => void }) => {

	const { id, date, workoutType, workoutEnded } = workout

	const option = workoutOptions.find(opt => opt.value === workout.workoutType);
	const label = option ? option.value : workout.workoutType;

	const handleLongPress = () => {
		Alert.alert(
			"Delete Workout",
			"Are you sure you want to delete this workout?",
			[
				{ text: "Cancel", style: "cancel" },
				{ text: "Change Type", onPress: () => onChangeType(id) },
				{ text: "Delete", style: "destructive", onPress: () => onDelete(id) }
			]
		)
	}

	return (
		<Link
			href={{
				pathname: `./workouts/${id}`,
				params: { themeColor: workout.color, workoutEnded: workout?.workoutEnded ? "1" : "0" }
			}}
			asChild
			style={styles.shadowContainer}
		>
			<TouchableOpacity
				style={styles.fullWidth}
				onLongPress={handleLongPress}
				delayLongPress={600}
				onPress={() => {
					setLetRefresh(true);  
				}}
			>
				<View
					style={[
						styles.leftBox,
						{
							backgroundColor: workout.color ?? "#CCCCCC"
						},
					]}>

				</View>

				{workoutEnded ?
					<View style={styles.detailsContainer}>
						<View style={styles.rowBetween}>
							<Text style={styles.workoutTypeText}>{label}</Text>
							<Text style={styles.textDateBold} numberOfLines={1}>{date}</Text>
						</View>

						<View style={styles.rowBetween}>
							<Text style={styles.textDurationBold} numberOfLines={1}>
								dur: {durationHHMMSS(id, workoutEnded)}
							</Text>
							<Text style={styles.textDifference} numberOfLines={1}>
								{timeHHMM(id)} - {timeHHMM(workoutEnded)}
							</Text>
						</View>
					</View>
					:
					<View style={styles.detailsContainer}>
						<View style={styles.rowBetween}>
							<Text style={styles.workoutTypeText}>{label}</Text>
							<Text style={styles.textDateBold} numberOfLines={1}>{date}</Text>
						</View>

						<View style={styles.rowBetween}>
							<Text style={styles.textDurationBold} numberOfLines={1}>
							</Text>
							<Text style={styles.textDifference} numberOfLines={1}>
							</Text>
						</View>
					</View>
				}
			</TouchableOpacity>
		</Link>
	)
}
const styles = StyleSheet.create({
	fullWidth: {
		width: "100%",
		alignSelf: "stretch",
	},
	shadowContainer: {
		elevation: 3,
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		backgroundColor: Colors[colorScheme ?? 'light'].secondary,
		marginTop: 20,
		borderRadius: 16,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: Colors[colorScheme ?? 'light'].tint,
	},
	leftBox: {
		justifyContent: "center",
		alignItems: "center",
		width: 60,
		height: 80,
		marginLeft: -2,
		borderRightWidth: 1,
		borderColor: Colors[colorScheme ?? 'light'].tint,
	},
	workoutTypeText: {
		fontSize: 20,
		fontWeight: 'bold',
		color: Colors[colorScheme ?? 'light'].text,
	},
	col: {
		flexDirection: "column",
		justifyContent: "center",
		width: "100%",
		top: 0,
	},
	row: {
		flexDirection: "row",
	},
	textDateBold: {
		fontSize: 20,
		fontWeight: "bold",
		color: Colors[colorScheme ?? 'light'].text,
	},
	textDurationBold: {
		fontSize: 20,
		color: Colors[colorScheme ?? 'light'].text,
		fontWeight: "bold",
	},
	textDifference: {
		fontSize: 20,
		color: Colors[colorScheme ?? 'light'].text,
	},
	detailsContainer: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
		paddingVertical: 4,
		paddingHorizontal: 10,
	},

	rowBetween: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
})
export default WorkoutCard