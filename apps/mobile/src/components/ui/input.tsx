import { Colors } from '@/constants/theme';
import { useMemo, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  useColorScheme,
} from 'react-native';
import { FText } from '../f-text';

type Color = 'transparent';

type Props = TextInputProps & {
  Icon?: React.ElementType;
  color?: Color;
};

export const AppInput = ({ children, style, Icon, color, ...props }: Props) => {
  const theme = useColorScheme();
  const [focused, setFocused] = useState(false);

  const backgroundColor = useMemo(() => {
    if (color === 'transparent') return 'rgba(255, 255, 255, 0.15)';
    return theme === 'dark' ? '#424242' : 'white';
  }, [theme, color]);

  const placeholderColor = useMemo(() => {
    if (color === 'transparent') return '#e2e8f0';
    return theme === 'dark' ? '#a1a1aa' : '#4b5563';
  }, [theme, color]);

  const textColor = useMemo(() => {
    if (color === 'transparent') return 'white';
    return theme === 'dark' ? 'white' : 'black';
  }, [theme, color]);

  const borderColor = useMemo(() => {
    if (focused) return Colors.emerald500;
    if (color === 'transparent') return 'rgba(255, 255, 255, 0.3)';

    if (theme === 'dark') {
      return Colors.stone400;
    }
    return Colors.gray300;
  }, [focused, color, theme]);

  function onBlur() {
    setFocused(false);
  }

  function onFocus() {
    setFocused(true);
  }

  return (
    <View style={[styles.container, style]}>
      {children}
      <View style={[styles.inputContainer, { backgroundColor, borderColor }]}>
        {Icon && (
          <View style={[styles.icon]}>
            <Icon color={placeholderColor} size={18} />
          </View>
        )}
        <TextInput
          {...props}
          style={[styles.input, { color: textColor }]}
          placeholderTextColor={placeholderColor}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </View>
    </View>
  );
};

export const AppLabel = ({ children, style }: Props) => {
  return (
    // <View style={styles.labelContainer}>
    <FText style={[style]}>{children}</FText>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // textAlign: "left",
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  input: {
    flexGrow: 1,
    fontSize: 16,
    padding: 0,
  },
  icon: {
    marginRight: 4,
  },
});
