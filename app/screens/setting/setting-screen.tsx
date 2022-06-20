import React, { FC, useEffect, useRef, useState } from "react"
import { View, ViewStyle, TextStyle, ImageStyle, SafeAreaView } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Button, Header, Screen, GradientBackground } from "../../components"
import { color, spacing, typography } from "../../theme"
import { NavigatorParamList } from "../../navigators"
import {
  Flex,
  Button as NBButton,
  VStack,
  HStack,
  ZStack,
  Radio,
  Box,
  Pressable,
  Badge,
  Spacer,
  Text,
  Icon,
  ChevronLeftIcon,
  IconButton,
  Image,
  Switch,
} from "native-base"
import { SelectableBox } from "../../components/selectable-box/selectable-box"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import * as Notifications from "expo-notifications"
import { Subscription } from "expo-modules-core"
import { CommonButton } from "../../components/common-button/common-button"
import moment from "moment"
import { SettingState } from "../../utils/setting-state"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[0],
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

export const SettingScreen: FC<StackScreenProps<NavigatorParamList, "setting">> = observer(
  ({ navigation }) => {
    const [notification, setNotification] = useState<Notifications.Notification | null>(null)
    const notificationListener = useRef<Subscription>()
    const responseListener = useRef<Subscription>()
    const [isNoti, setIsNoti] = useState<boolean>(false)

    useEffect(() => {
      console.log("run this")
      SettingState.isDailySummary().then((result) => setIsNoti(result))

      notificationListener.current = Notifications.addNotificationReceivedListener(
        (notification) => {
          setNotification(notification)
        },
      )

      responseListener.current = Notifications.addNotificationResponseReceivedListener(
        (response) => {
          console.log(response)
        },
      )

      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current)
        Notifications.removeNotificationSubscription(responseListener.current)
      }
    }, [])

    return (
      <View testID="WelcomeScreen" style={FULL}>
        <Screen style={CONTAINER} preset="scroll" backgroundColor={color.palette.background}>
          <Flex mt="20px" direction="row" alignItems="center">
            <IconButton
              borderRadius="full"
              _icon={{
                color: "white",
                size: "md",
              }}
              w="40px"
              h="40px"
              onPress={() => navigation.navigate("home")}
              icon={<ChevronLeftIcon h="60px" w="60px" />}
            ></IconButton>
            <Text color={color.palette.text} fontWeight="bold" fontSize="4xl">
              Setting ⚙️
            </Text>
          </Flex>
          <Flex pl="5" pr="5" mt="20px">
            <HStack justifyContent="space-between" alignItems="center">
              <Text color={color.palette.text} fontWeight="bold" fontSize="2xl">
                Daily Summary
              </Text>
              <Switch
                colorScheme="yellow"
                value={isNoti}
                onValueChange={async (e) => {
                  await SettingState.setIsDailySummary(e)
                  setIsNoti(e)
                }}
              />
            </HStack>
            <Text color={color.palette.text} fontWeight="normal" fontSize="md">
              Sum up your emotions every day
            </Text>
          </Flex>
        </Screen>
      </View>
    )
  },
)
