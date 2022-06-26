import React, { FC, useEffect, useRef, useState } from "react"
import { View, ViewStyle, TextStyle, ImageStyle, SafeAreaView } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Button, Header, Screen, GradientBackground } from "../../components"
import { spacing, color } from "../../theme"
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
  ScrollView,
} from "native-base"
import { SelectableBox } from "../../components/selectable-box/selectable-box"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import * as Notifications from "expo-notifications"
import { Subscription } from "expo-modules-core"
import { CommonButton } from "../../components/common-button/common-button"
import moment from "moment"
import { SettingState } from "../../utils/setting-state"
import { palette, paletteGreen } from "../../theme/palette"
import { ColorTheme, ColorThemeUtil } from "../../models/colorTheme"
import { useColorTheme } from "../../hooks/useThemeColor"
import { MainFeed } from "../../components/main-feed/main-feed"
import { MoodUtil } from "../../models/mood"

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

interface ThemeStyleBoxProps {
  onChanged: (ColorTheme) => void
  colorTheme: ColorTheme
}

const ThemeStyleBox = (props: ThemeStyleBoxProps) => {
  return (
    <Pressable
      onPress={() => {
        props.onChanged(props.colorTheme)
      }}
    >
      <Box
        w="80px"
        h="80px"
        rounded="10px"
        p="5px"
        background={{
          linearGradient: {
            colors: [
              props.colorTheme.palette.backgroundHightlight,
              props.colorTheme.palette.backgroundHightlightShade,
            ],
            start: [1, 0],
            end: [0, 1],
          },
        }}
      >
        <Text fontWeight="bold" color={props.colorTheme.palette.text}>
          {props.colorTheme.name}
        </Text>
        <Box
          w="50px"
          h="20px"
          rounded="5px"
          p="5px"
          background={{
            linearGradient: {
              colors: [props.colorTheme.palette.colorful1, props.colorTheme.palette.colorful2],
              start: [1, 0],
              end: [0, 1],
            },
          }}
        ></Box>
      </Box>
    </Pressable>
  )
}

export const SettingScreen: FC<StackScreenProps<NavigatorParamList, "setting">> = observer(
  ({ navigation }) => {
    const { colorTheme, setColorTheme } = useColorTheme()
    const [notification, setNotification] = useState<Notifications.Notification | null>(null)
    const notificationListener = useRef<Subscription>()
    const responseListener = useRef<Subscription>()
    const [isNoti, setIsNoti] = useState<boolean>(false)

    useEffect(() => {
      // console.log("run this")
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
        <Screen style={CONTAINER} preset="scroll" backgroundColor={colorTheme.palette.background}>
          <Flex mt="20px" direction="row" alignItems="center">
            <IconButton
              borderRadius="full"
              _icon={{
                color: colorTheme.palette.text,
                size: "md",
              }}
              w="40px"
              h="40px"
              onPress={() => navigation.navigate("home")}
              icon={<ChevronLeftIcon h="60px" w="60px" />}
            ></IconButton>
            <Text color={colorTheme.palette.text} fontWeight="bold" fontSize="4xl">
              Setting ⚙️
            </Text>
          </Flex>
          {/* <Flex pl="5" pr="5" mt="20px">
            <HStack justifyContent="space-between" alignItems="center">
              <Text color={colorTheme.palette.text} fontWeight="bold" fontSize="2xl">
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
            <Text color={colorTheme.palette.text} fontWeight="normal" fontSize="md">
              Sum up your emotions every day
            </Text>
          </Flex> */}
          <Flex pl="5" pr="5" mt="20px">
            <HStack justifyContent="space-between" alignItems="center">
              <Text color={colorTheme.palette.text} fontWeight="bold" fontSize="2xl">
                Color Style
              </Text>
            </HStack>
            <ScrollView>
              <HStack space="md">
                {ColorThemeUtil.colorThemes.map((theme) =>
                  ThemeStyleBox({
                    onChanged: (selectedPalette) => {
                      console.log("change color")
                      setColorTheme(selectedPalette)
                    },
                    colorTheme: theme,
                  }),
                )}
              </HStack>
            </ScrollView>
            <Text
              mt="10px"
              mb="10px"
              color={colorTheme.palette.text}
              fontWeight="bold"
              fontSize="xl"
            >
              Sample
            </Text>
            <MainFeed
              feed={{
                id: new Date().getTime(),
                emotion: MoodUtil.moods[0].code,
                content: "Lorem ipsum",
                image: "",
                imageRatio: 1,
                imageBase64: "",
              }}
              onClick={() => {}}
              onLongTap={() => {}}
            />
          </Flex>
        </Screen>
      </View>
    )
  },
)
