import { FollowsScreen } from "@/features/user/screens/follows";
import { UserScreen } from "@/features/user/screens/user";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export const UserStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    UserScreen,
    FollowsScreen,
  },
});
