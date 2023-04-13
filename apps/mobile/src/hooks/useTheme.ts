import { Appearance, useColorScheme } from 'react-native';

// Any rendering logic or styles that depend on this should try to call this function on every render or use the useTheme hook.
export function isDarkTheme() {
	return Appearance.getColorScheme() === 'dark';
}

export function useTheme() {
	const theme = useColorScheme();
	return {
		theme: theme === 'dark' ? 'dark' : 'light',
		isDark: theme === 'dark',
		isLight: theme === 'light'
	};
}
