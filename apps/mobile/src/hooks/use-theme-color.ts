/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import {useColorScheme} from 'react-native'


export function useThemeColor(
  props: { light: string; dark: string },
) {
  const theme = useColorScheme();
  const key = theme === 'dark' ? 'dark' : 'light';
  const colorFromProps = props[key];

  return colorFromProps;
}
