/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import React from "react"
import { useColorScheme } from "react-native"
import { NavigationContainer, DefaultTheme } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import {
  WelcomeScreen,
  DemoScreen,
  DemoListScreen,
  SettingScreen,
  HomeScreen,
  VocabScreen,
} from "../screens"
import { navigationRef, useBackButtonHandler } from "./navigation-utilities"
import { YourdayScreen } from "../screens/yourday/yourday-screen"
import { YourdayTextScreen } from "../screens/yourday-text/yourday-text-screen"
import { MoodModel } from "../models/mood"
import { CameraScreen } from "../screens/camera/camera-screen"
import { Feed } from "../models/feed-store/feed"
import { OnboardingScreen } from "../screens/onboarding/onboarding-screen"
import { OnboardingNotiScreen } from "../screens/onboarding-noti/onboarding-noti-screen"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */
export type NavigatorParamList = {
  welcome: undefined
  demo: undefined
  demoList: undefined
  setting: undefined
  home: {
    afterPost?: boolean
  }
  vocab: undefined
  yourday: undefined
  yourdayText: {
    mood: MoodModel
  }
  camera: {
    onGoBack: (imageData: any) => void
  }
  onboarding: undefined
  onboardingNoti: undefined
  // 🔥 Your screens go here
}

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<NavigatorParamList>()

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="home"
    >
      <Stack.Screen name="onboarding" component={OnboardingScreen} />
      <Stack.Screen name="onboardingNoti" component={OnboardingNotiScreen} />
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen name="setting" component={SettingScreen} />
      <Stack.Screen name="welcome" component={WelcomeScreen} />
      <Stack.Screen name="demo" component={DemoScreen} />
      <Stack.Screen name="vocab" component={VocabScreen} />
      <Stack.Screen name="demoList" component={DemoListScreen} />
      <Stack.Screen name="yourday" component={YourdayScreen} />
      <Stack.Screen name="yourdayText" component={YourdayTextScreen} />
      <Stack.Screen name="camera" component={CameraScreen} />

      {/** 🔥 Your screens go here */}
    </Stack.Navigator>
  )
}

interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = (props: NavigationProps) => {
  const colorScheme = useColorScheme()
  useBackButtonHandler(canExit)
  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DefaultTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
}

AppNavigator.displayName = "AppNavigator"

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ["welcome"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
