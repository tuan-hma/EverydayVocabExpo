/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */
import "./i18n"
import "./utils/ignore-warnings"
import React, { useState, useEffect } from "react"
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context"
import { initFonts } from "./theme/fonts" // expo
import * as storage from "./utils/storage"
import { AppNavigator, useNavigationPersistence } from "./navigators"
import { RootStore, RootStoreProvider, setupRootStore } from "./models"
import { ToggleStorybook } from "../storybook/toggle-storybook"
import { ErrorBoundary } from "./screens/error/error-boundary"
import { extendTheme, NativeBaseProvider } from "native-base"
// eslint-disable-next-line camelcase
import { useFonts, Nunito_400Regular, Nunito_700Bold } from "@expo-google-fonts/nunito"
import AppLoading from "expo-app-loading"
import { LinearGradient } from "expo-linear-gradient"

// This puts screens in a native ViewController or Activity. If you want fully native
// stack navigation, use `createNativeStackNavigator` in place of `createStackNavigator`:
// https://github.com/kmagiera/react-native-screens#using-native-stack-navigator

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

/**
 * This is the root component of our app.
 */
function App() {
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)

  // Kick off initial async loading actions, like loading fonts and RootStore
  useEffect(() => {
    ;(async () => {
      await initFonts() // expo
      setupRootStore().then(setRootStore)
    })()
  }, [])

  let [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  })

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.
  if (!rootStore || !isNavigationStateRestored) return null

  const theme = extendTheme({
    fontConfig: {
      Roboto: {
        100: {
          normal: "Roboto-Light",
          italic: "Roboto-LightItalic",
        },
        200: {
          normal: "Roboto-Light",
          italic: "Roboto-LightItalic",
        },
        300: {
          normal: "Roboto-Light",
          italic: "Roboto-LightItalic",
        },
        400: {
          normal: "Roboto-Regular",
          italic: "Roboto-Italic",
        },
        500: {
          normal: "Roboto-Medium",
        },
        600: {
          normal: "Roboto-Medium",
          italic: "Roboto-MediumItalic",
        },
        // Add more variants
        //   700: {
        //     normal: 'Roboto-Bold',
        //   },
        //   800: {
        //     normal: 'Roboto-Bold',
        //     italic: 'Roboto-BoldItalic',
        //   },
        //   900: {
        //     normal: 'Roboto-Bold',
        //     italic: 'Roboto-BoldItalic',
        //   },
      },
      Nunito: {
        400: {
          normal: "Nunito_400Regular",
          italic: "Nunito_400Regular",
        },
        700: {
          normal: "Nunito_700Bold",
          italic: "Nunito_700Bold",
        },
        800: {
          normal: "Nunito_800Bold",
          italic: "Nunito_800Bold",
        },
      },
    },

    // Make sure values below matches any of the keys in `fontConfig`
    fonts: {
      heading: "Nunito",
      body: "Nunito",
      mono: "Nunito",
    },
  })

  if (!fontsLoaded) {
    return <AppLoading />
  }

  const config = {
    dependencies: {
      "linear-gradient": LinearGradient,
    },
  }

  // otherwise, we're ready to render the app
  return (
    <ToggleStorybook>
      <RootStoreProvider value={rootStore}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <NativeBaseProvider theme={theme} config={config}>
            <ErrorBoundary catchErrors={"always"}>
              <AppNavigator
                initialState={initialNavigationState}
                onStateChange={onNavigationStateChange}
              />
            </ErrorBoundary>
          </NativeBaseProvider>
        </SafeAreaProvider>
      </RootStoreProvider>
    </ToggleStorybook>
  )
}

export default App
