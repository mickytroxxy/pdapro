import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, RootState, store } from '@/src/state/store';
import { Provider, useSelector } from 'react-redux';
import { Image, Platform, TouchableOpacity, View } from 'react-native';
import Icon from '@/components/ui/Icon';
import { Colors, colors } from '@/constants/Colors';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Define the initial route for the app
export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    fontLight: require('../assets/fonts/MontserratAlternates-Light.otf'),
    fontBold: require('../assets/fonts/MontserratAlternates-Bold.otf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <PersistGate loading={null} persistor={persistor}>
        <Provider store={store}>
          <Main />
        </Provider>
        <StatusBar style='light' backgroundColor={Colors.dark.darkBlue} />
      </PersistGate>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const Main = () => {
  const router = useRouter();
  return (
    <View style={{flex:1}}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.dark.darkBlue,
          },
          headerTitle: () => 
            <View style={{alignItems:'center'}}>
               <Image source={require('@/assets/images/icon.png')} style={{width:60, height:60}} />
            </View>,
          headerTintColor: "#fff",
          headerTitleStyle: {fontFamily:'fontBold',fontSize:12}
        }}
      >
        
        <Stack.Screen name="index"/>
      </Stack>
    </View>
  );
}
