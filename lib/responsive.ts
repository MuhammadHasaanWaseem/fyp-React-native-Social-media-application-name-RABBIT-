import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Based on iPhone 11 dimensions ~ 414 x 896 as guideline baseline
const BASE_WIDTH = 390; // choose a common baseline (iPhone 12 mini / 13 mini ~ 390)
const BASE_HEIGHT = 844; // common height baseline

export const wp = (percent: number) => {
  const value = (SCREEN_WIDTH * percent) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

export const hp = (percent: number) => {
  const value = (SCREEN_HEIGHT * percent) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

export const scale = (size: number) => {
  return Math.round(PixelRatio.roundToNearestPixel((SCREEN_WIDTH / BASE_WIDTH) * size));
};

export const verticalScale = (size: number) => {
  return Math.round(PixelRatio.roundToNearestPixel((SCREEN_HEIGHT / BASE_HEIGHT) * size));
};

export default {
  wp,
  hp,
  scale,
  verticalScale,
};
