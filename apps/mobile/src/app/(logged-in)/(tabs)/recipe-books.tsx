import { AppText } from '@/components/ui/text';
import { BookOpen, ChevronRight, Heart } from 'lucide-react-native';
import {
  StyleSheet,
  useColorScheme,
  View,
  FlatList,
  ScrollView,
  ViewStyle,
  StyleProp,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { recipeBookGradients } from '@/constants/gradients';
export default function RecipeBooksScreen() {
  const theme = useColorScheme();

  const likedBorderColor = theme === 'dark' ? '#831843' : '#fce7f3';
  const likedBackgroundColor = theme === 'dark' ? '#424242' : '#ffffff';
  const likedTextColor = theme === 'dark' ? '#9ca3af' : '#6b7280';

  const data = new Array(10).fill(0);

  const [refreshing, setRefreshing] = useState(false);
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.likedContainer,
          {
            borderColor: likedBorderColor,
            backgroundColor: likedBackgroundColor,
          },
        ]}
      >
        <View style={styles.likedHeartContainer}>
          <LinearGradient
            style={styles.likedHeart}
            colors={['#f472b6', '#ef4444']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Heart size={32} color="white" />
          </LinearGradient>
          <View style={styles.likedTextContainer}>
            <AppText style={{ fontWeight: 'bold', fontSize: 18 }}>
              Liked Recipes
            </AppText>
            <AppText style={{ color: likedTextColor }}>
              All your favorite recipes in one place
            </AppText>
          </View>
          <View style={styles.likedArrowContainer}>
            <ChevronRight color={likedTextColor} />
          </View>
        </View>
      </View>
      <View style={styles.yourBooksHeader}>
        <AppText style={styles.yourBooksHeaderText}>Your Books</AppText>
      </View>
      <FlatList
        data={data}
        style={{ flex: 1 }}
        renderItem={({ item, index }) => (
          <RecipeBookItem
            even={index % 2 === 0}
            last={index === data.length - 1}
            index={index}
          />
        )}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        columnWrapperStyle={{ marginBottom: 10 }}
        // refreshControl={<RefreshControl refreshing={true} />}
      />
    </View>
  );
}

function RecipeBookItem({
  even,
  last,
  index,
}: {
  even: boolean;
  last: boolean;
  index: number;
}) {
  const theme = useColorScheme();
  const backgroundColor = theme === 'dark' ? '#424242' : '#ffffff';
  const color = theme === 'dark' ? '#9ca3af' : '#6b7280';

  let margin = 10;
  if (last) {
    margin = margin * 2;
  }
  const marginRight = even ? margin : 0;
  const marginLeft = even ? 0 : margin;

  const gradientIndex = index % recipeBookGradients.length;
  const gradients = recipeBookGradients[gradientIndex]!;

  const background =
    theme === 'dark' ? gradients.backgroundDark : gradients.background;
  const text = theme === 'dark' ? gradients.textDark : gradients.text;
  console.log(background, text);
  return (
    <View
      style={[
        styles.yourBooksItem,
        { backgroundColor },
        { marginRight, marginLeft },
      ]}
    >
      <LinearGradient
        style={styles.yourBooksItemGradient}
        colors={background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <BookOpen size={45} color={text} />
      </LinearGradient>
      <View style={styles.yourBooksItemTextContainer}>
        <AppText>Your asdf</AppText>
        <AppText style={{ color }}>12 recipes</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flex: 1,
  },
  likedContainer: {
    borderRadius: 12,
    borderWidth: 1,
  },
  likedHeartContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
  },
  likedHeart: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  likedTextContainer: {
    flex: 1,
    marginLeft: 16,
    display: 'flex',
    justifyContent: 'center',
  },
  likedArrowContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  yourBooksHeader: {
    marginVertical: 16,
    display: 'flex',
  },
  yourBooksHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    flexGrow: 1,
  },
  yourBooksContainer: {
    display: 'flex',
    gap: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  yourBooksRow: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  },
  yourBooksItem: {
    borderRadius: 12,
    overflow: 'hidden',
    flex: 1 / 2,
  },
  yourBooksItemGradient: {
    height: 128,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  yourBooksItemTextContainer: {
    padding: 12,
  },
});
