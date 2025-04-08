import { useColorScheme, View } from "react-native";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { AppProviders } from "./providers";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AppHeader from "@/components/app-header";
import { Book, CookingPot, House } from "lucide-react-native";
import { HomeScreen } from "@/app/routes/home";
import RecipeBooksScreen from "./routes/recipe-books";
import RecipesScreen from "./routes/recipes";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SignInScreen } from "./routes/auth/sign-in";
import { DarkTheme, LightTheme } from "@/constants/theme";
import { SignUpScreen } from "./routes/auth/sign-up";
import { useIsSignedIn, useIsSignedOut } from "@/hooks/is-signed-in";
import { Colors } from "@/constants/colors";

const HomeTabs = createBottomTabNavigator({
  screenOptions: {
    header: (props) => <AppHeader {...props} />,
    tabBarShowLabel: false,
    tabBarItemStyle: {
      alignItems: "center",
      flexDirection: "row",
    },
  },
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        title: "Food Swipe",
        tabBarIcon: ({ color, size }) => <House size={size} color={color} />,
      },
    },
    Recipes: {
      screen: RecipesScreen,
      options: {
        title: "Recipes",
        tabBarIcon: ({ color, size }) => (
          <CookingPot size={size} color={color} />
        ),
      },
    },
    RecipeBooks: {
      screen: RecipeBooksScreen,
      options: {
        title: "Recipe Books",
        tabBarIcon: ({ color, size }) => <Book size={size} color={color} />,
      },
    },
  },
});

const RootStack = createNativeStackNavigator({
  initialRouteName: "SignIn",
  screenOptions: {
    headerShown: false,
  },
  screens: {
    SignIn: SignInScreen,
    SignUp: SignUpScreen,
  },
  // groups: {
  //   Auth: {
  //     if: useIsSignedOut,
  //     screens: {
  //       SignIn: SignInScreen,
  //       SignUp: SignUpScreen,
  //     },
  //   },
  //   SignedIn: {
  //     if: useIsSignedIn,
  //     screens: {
  //       HomeTabs: HomeTabs,
  //     },
  //   },
  // },
});

const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export function App() {
  const theme = useColorScheme();
  const backgroundColor = theme === "dark" ? Colors.dark900 : Colors.gray50;

  return (
    <AppProviders>
      <View style={{ flex: 1, backgroundColor }}>
        <Navigation theme={theme === "dark" ? DarkTheme : LightTheme} />
      </View>
    </AppProviders>
  );
}
