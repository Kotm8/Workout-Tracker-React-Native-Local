import { faceIcons } from '@/constants/icons';
import { Colors } from '@/constants/theme';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

const colorScheme = 'light'

const FaceRadioCard = ({ exerciseLevel, onChange, workoutType }:
	{
		exerciseLevel: number;
		onChange?: (updateLevel: number) => void;
		workoutType?: string;
	}) => {

	const [level, setLevel] = useState(exerciseLevel);

	useEffect(() => {
		setLevel(exerciseLevel);
	}, [exerciseLevel]);

	const handleLevelChange = (newLevel: number) => {
		setLevel(newLevel);
		onChange?.(newLevel);
	};


	return (
		<View style={styles.container}>
			{faceIcons.map((icon) => (
				<TouchableOpacity key={icon.id} onPress={() => handleLevelChange(icon.id)}>
					<Image
						source={icon.src}
						style={{
							width: 40,
							height: 40,
							opacity: level === icon.id ? 1 : 0.3,
							borderColor: Colors[colorScheme ?? 'light'].tint,
							borderWidth: 2,
							borderRadius: 20,
						}}
					/>
				</TouchableOpacity>
			))}
		</View>
	)
}
const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		marginBottom: 8,
		marginTop: 20,
		justifyContent: 'space-around',
		alignItems: 'center'
	}
})
export default FaceRadioCard