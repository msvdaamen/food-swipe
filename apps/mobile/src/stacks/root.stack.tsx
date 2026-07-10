import { SignIn } from "@/features/auth/screens/sign-in";
import { SignUp } from "@/features/auth/screens/sign-up";
import { useIsSignedIn } from "@/hooks/is-signed-in";
import { useIsSignedOut } from "@/hooks/is-signed-out";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator, createBottomTabScreen } from "@react-navigation/bottom-tabs";
import { House, User } from "lucide-react-native";
import { ProfileScreen } from "@/features/user/screens/profile";
import { Colors } from "@/constants/colors";
import { RecipesScreen } from "@/features/recipe/screens/recipes";
import { UserStack } from "./user.stack";
import { RecipeScreen } from "@/features/recipe/screens/recipe";

const MyTabs = createBottomTabNavigator({
  screenOptions: {
    headerShown: false,
    tabBarActiveTintColor: Colors.emerald600,
  },
  screens: {
    Recipes: createBottomTabScreen({
      screen: RecipesScreen,
      options: {
        tabBarIcon: ({ color }) => <House size={28} color={color} />,
      },
    }),
    Profile: createBottomTabScreen({
      screen: ProfileScreen,
      options: {
        tabBarIcon: ({ color }) => <User size={28} color={color} />,
      },
    }),
  },
});

export const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  groups: {
    SignedIn: {
      if: useIsSignedIn,
      screens: {
        MyTabs,
        RecipeScreen: {
          screen: RecipeScreen,
          options: {
            presentation: "formSheet",
            title: "User",
            headerShown: false,
          },
        },
        UserStack,
      },
    },
    LoggedOut: {
      if: useIsSignedOut,
      screens: {
        SignIn,
        SignUp,
      },
    },
  },
});
