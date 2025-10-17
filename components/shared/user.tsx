import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

type Props = {
	user?: {
		username?: string;
		avatar?: string;
	} | null;
};

export default function User({ user }: Props) {
	const avatarSource = user?.avatar ? { uri: user.avatar } : require('../../assets/gif/RAB.gif');
	return (
		<View style={styles.container}>
			<Image source={avatarSource} style={styles.avatar} />
			<Text style={styles.username}>{user?.username ?? 'Unknown User'}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		padding: 16,
	},
	avatar: {
		width: 80,
		height: 80,
		borderRadius: 40,
		marginBottom: 8,
	},
	username: {
		color: 'white',
		fontWeight: '700',
		fontSize: 16,
	},
});
