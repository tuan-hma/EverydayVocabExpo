import React, { FC, useEffect, useRef, useState } from "react"
import { View, ViewStyle, TextStyle, ImageStyle, SafeAreaView } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Button, Header, Screen, GradientBackground } from "../../components"
import { spacing, color } from "../../theme"
import { NavigatorParamList } from "../../navigators"
import Analytics from "expo-firebase-analytics"
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
  Select,
  CheckIcon,
} from "native-base"

import * as Notifications from "expo-notifications"
import { Subscription } from "expo-modules-core"

import { ColorTheme, ColorThemeUtil } from "../../models/colorTheme"
import { MainFeed } from "../../components/main-feed/main-feed"
import { MoodUtil } from "../../models/mood"
import { useStores } from "../../models"
import * as Haptics from "expo-haptics"
import { SettingOptionIdDefine } from "../../models/setting-option-store/setting-option"
import { scheduleRemindNoti } from "../../utils/notification"

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
  isSelected: boolean
}

const ThemeStyleBox = (props: ThemeStyleBoxProps) => {
  return (
    <Pressable
      onPressIn={() => {
        Haptics.selectionAsync()
      }}
      onPress={() => {
        // Haptics.selectionAsync()
        props.onChanged(props.colorTheme)
      }}
    >
      {({ isHovered, isFocused, isPressed }) => {
        return (
          <Box
            // borderWidth={props.isSelected ? "2px" : "0px"}
            // borderColor={props.colorTheme.palette.text}
            w="80px"
            h="80px"
            rounded="10px"
            p="5px"
            style={{
              transform: [
                {
                  scale: isPressed ? 0.96 : 1,
                },
              ],
            }}
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
        )
      }}
    </Pressable>
  )
}

export const SettingScreen: FC<StackScreenProps<NavigatorParamList, "setting">> = observer(
  ({ navigation }) => {
    const [isNoti, setIsNoti] = useState<boolean>(false)
    const [notiTime, setNotiTime] = React.useState("")
    const { settingOptionStore, feedStore } = useStores()
    const colorTheme = ColorThemeUtil.getColorThemeById(
      settingOptionStore.getSettingOption(SettingOptionIdDefine.colorTheme),
    )

    useEffect(() => {
      setIsNoti(!isNoti)
      setNotiTime(settingOptionStore.getSettingOption(SettingOptionIdDefine.notificationTime))
    }, [settingOptionStore])

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
              Customize
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
          {/* Color Style */}
          <Flex pl="5" pr="5" mt="20px">
            <HStack justifyContent="space-between" alignItems="center">
              <Text mb="10px" color={colorTheme.palette.text} fontWeight="bold" fontSize="2xl">
                Color Style
              </Text>
            </HStack>
            <ScrollView>
              <HStack space="md">
                {ColorThemeUtil.colorThemes.map((theme) =>
                  ThemeStyleBox({
                    isSelected:
                      theme.id ===
                      settingOptionStore.getSettingOption(SettingOptionIdDefine.colorTheme),
                    onChanged: (selectedPalette: ColorTheme) => {
                      // feedStore.addFeed({
                      //   id: new Date().getTime(),
                      //   emotion: "happy",
                      //   content: "content",
                      //   image: "",
                      //   imageRatio: 1,
                      //   imageBase64: "",
                      // })
                      // Analytics.logEvent("Update Theme:" + selectedPalette.id, {})
                      settingOptionStore.setSettingOption({
                        id: SettingOptionIdDefine.colorTheme,
                        settingValue: selectedPalette.id,
                      })
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
          {/* Notification */}
          <Flex pl="5" pr="5" mt="40px">
            <HStack justifyContent="space-between" alignItems="center">
              <Text mb="10px" color={colorTheme.palette.text} fontWeight="bold" fontSize="2xl">
                Notification Setting
              </Text>
            </HStack>
            <HStack justifyContent="space-between" alignItems="center">
              <Text color={colorTheme.palette.text} fontWeight="bold" fontSize="md">
                Send on:
              </Text>
              <Select
                background={colorTheme.palette.background}
                color={colorTheme.palette.text}
                _text={{
                  color: colorTheme.palette.text,
                }}
                _actionSheetBody={{
                  background: colorTheme.palette.background,
                }}
                _actionSheetContent={{
                  background: colorTheme.palette.background,
                }}
                selectedValue={notiTime}
                minWidth="200"
                accessibilityLabel="Notification Time"
                placeholder="Notification Time"
                _selectedItem={{
                  borderRadius: "10px",
                  bg: colorTheme.palette.backgroundSelected,
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                onValueChange={(itemValue) => {
                  setNotiTime(itemValue)
                  scheduleRemindNoti(itemValue)
                  settingOptionStore.setSettingOption({
                    id: SettingOptionIdDefine.notificationTime,
                    settingValue: itemValue,
                  })
                }}
              >
                <Select.Item
                  _text={{
                    color: colorTheme.palette.text,
                  }}
                  background={color.transparent}
                  _pressed={{
                    background: colorTheme.palette.backgroundSelected,
                  }}
                  label="Off"
                  value="off"
                />
                {Array.from({ length: 24 }, (v, k) => k + 1).map((i) => (
                  <Select.Item
                    _text={{
                      color: colorTheme.palette.text,
                    }}
                    rounded="10px"
                    background={color.transparent}
                    _pressed={{
                      background: colorTheme.palette.backgroundSelected,
                    }}
                    key={`noti-select-${i}`}
                    label={`${("0" + i).slice(-2)}:00`}
                    value={`${i}`}
                  />
                ))}
              </Select>
            </HStack>
          </Flex>
        </Screen>
      </View>
    )
  },
)
