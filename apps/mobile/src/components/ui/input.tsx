import { LucideProps, Search } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, TextInputProps, View, useColorScheme } from "react-native"
import { TextInput } from "react-native"


type Props = TextInputProps & {
    Icon?: React.ElementType;
}


export const AppInput = ({ children, style, Icon, ...props }: Props) => {
    const theme = useColorScheme();
    const [focused, setFocused] = useState(false);

    const backgroundColor = theme === 'dark' ? '#424242' : 'white';
    const placeholderColor = theme === 'dark' ? '#a1a1aa' : '#4b5563';
    const textColor = theme === 'dark' ? 'white' : 'black';
    const borderColor = focused ? 'rgb(5 150 105)' : 'rgb(97 97 97)';

    return <View style={[styles.container, { backgroundColor, borderColor }]}>
        {Icon && <View style={[styles.icon]}>
            <Icon color={placeholderColor} size={18} />
        </View>}
        <TextInput
            style={[styles.input, style, { color: textColor }]}
            placeholderTextColor={placeholderColor}
            {...props}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            >
                {children}
        </TextInput>
    </View>
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderWidth: 1,
        borderRadius: 10,
    },
    input: {
        flexGrow: 1,
        // borderWidth: 1,
        borderColor: 'gray',
        height: 30,
    },
    icon: {
        marginRight: 4
    }
})