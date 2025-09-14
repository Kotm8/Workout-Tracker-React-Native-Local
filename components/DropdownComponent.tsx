import React from 'react';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

interface DropdownItem {
	label: string;
	value: string;
}
interface DropdownComponentProps {
	data: DropdownItem[];
	placeholderString: string;
	value: string | null;
	onChange: (value: string) => void;
}

const DropdownComponent: React.FC<DropdownComponentProps> = ({ data, placeholderString, value, onChange }) => {

	return (
		<Dropdown
			style={styles.dropdown}
			placeholderStyle={styles.placeholderStyle}
			selectedTextStyle={styles.selectedTextStyle}
			inputSearchStyle={styles.inputSearchStyle}
			iconStyle={styles.iconStyle}
			data={data}
			maxHeight={300}
			labelField="label"
			valueField="value"
			placeholder={placeholderString}
			value={value}
			onChange={item => {
				onChange(item.value); 
			}}
		/>
	);
};

export default DropdownComponent;

const styles = StyleSheet.create({
	dropdown: {
		marginTop: 20,
		marginBottom: 20,
		height: 50,
		borderBottomColor: 'gray',
		borderBottomWidth: 0.5,
	},
	icon: {
		marginRight: 5,
	},
	placeholderStyle: {
		fontSize: 16,
	},
	selectedTextStyle: {
		fontSize: 16,
	},
	iconStyle: {
		width: 20,
		height: 20,
	},
	inputSearchStyle: {
		height: 40,
		fontSize: 16,
	},
});