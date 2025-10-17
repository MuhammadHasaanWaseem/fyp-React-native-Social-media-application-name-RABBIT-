const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Try to enable nativewind's metro plugin. If the native binary for lightningcss
// is missing or nativewind cannot be required, fall back to the default config.
try {
	// eslint-disable-next-line global-require
	const nativewind = require('nativewind/metro');
	if (nativewind && typeof nativewind.withNativeWind === 'function') {
		module.exports = nativewind.withNativeWind(config, { input: './global.css' });
	} else {
		console.warn('nativewind/metro found but withNativeWind is unavailable — using default metro config');
		module.exports = config;
	}
} catch (err) {
	console.warn('nativewind not available or failed to load. Falling back to default metro config.');
	// Optionally log the error in development for debugging
	if (process.env.NODE_ENV !== 'production') {
		console.warn(err && err.message ? err.message : err);
	}
	module.exports = config;
}