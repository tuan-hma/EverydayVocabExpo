import React, { FC, useEffect, useRef, useState } from "react"
import { View, ViewStyle, TextStyle, ImageStyle, SafeAreaView } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Button, Header, Screen, GradientBackground, AutoImage } from "../../components"
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
} from "native-base"
import { SelectableBox } from "../../components/selectable-box/selectable-box"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { ScrollView } from "react-native-gesture-handler"
import { VocabBox } from "../../components/vocab-box/vocab-box"
import * as Notifications from "expo-notifications"
import {
  registerForPushNotificationsAsync,
  schedulePushNotification,
} from "../../utils/notification"
import { useStores } from "../../models"
import { EmojiImage } from "../../utils/emoji-image"
import { MainFeed } from "../../components/main-feed/main-feed"
import moment from "moment"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[0],
}

const wavyBg = require("./wavy-bg.png")
const welcome = require("./welcome.png")

export const HomeScreen: FC<StackScreenProps<NavigatorParamList, "home">> = observer(
  ({ navigation }) => {
    const { feedStore } = useStores()
    const notificationListener = useRef()
    const responseListener = useRef()

    function DayPick(date: Date) {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      return (
        <Pressable flexBasis="14.28%" key={date.getDay()}>
          {({ isHovered, isFocused, isPressed }) => {
            return (
              <VStack alignItems="center">
                <Text color={color.palette.mildText} fontSize="md" fontWeight="bold">
                  {days[date.getDay()]}
                </Text>
                <Text color={color.palette.text} fontSize="lg" fontWeight="bold">
                  {date.getDate()}
                </Text>
              </VStack>
            )
          }}
        </Pressable>
      )
    }

    useEffect(() => {
      registerForPushNotificationsAsync().then((token) => console.log(token))

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
          <ZStack>
            <Image mt="130px" w="full" h="220px" source={wavyBg} />
            <Box mt="330px" w="full" h="900px" backgroundColor={color.palette.background}></Box>
          </ZStack>
          <Flex mr="10px" w="40px" h="40px" alignSelf="flex-end">
            <IconButton
              borderRadius="full"
              onPress={() => {
                console.log("testtest")
                navigation.navigate("yourday")
              }}
              icon={
                <Icon
                  size="xl"
                  as={MaterialCommunityIcons}
                  name="cog"
                  color="white"
                  _dark={{
                    color: "warmGray.50",
                  }}
                />
              }
            ></IconButton>
          </Flex>
          <HStack pt="0" p="5" pb="0" w="full">
            <Flex mt="-10px" direction="column">
              <Text color={color.palette.mildText} fontSize="md" fontWeight="bold">
                {moment().format("YYYY, dddd MMM DD")}
              </Text>
              <Text color={color.palette.text} fontWeight="bold" fontSize="3xl">
                Today
              </Text>
              <HStack>
                {[...Array(7).keys()].map((dateNum) =>
                  DayPick(moment().clone().weekday(dateNum).toDate()),
                )}
              </HStack>
            </Flex>
            <Spacer />
          </HStack>

          {/* <Flex p="5" mt="10px">
            <Text color="white" fontWeight="bold" fontSize="xl">
              Today's Vocab
            </Text>
            <VocabBox
              onClick={() => {
                // allowsNotificationsAsync()
                // navigation.navigate("vocab")
                feedStore.clearFeed()
              }}
              size="big"
              levelText={"Intermediate / N3"}
              hiragana={"せいひん"}
              kanji={"製品"}
              meaning={"product"}
              sample={"完成した製品を検査する"}
            />
          </Flex> */}

          <Flex mt="20px">
            <Text color={color.palette.text} pl="5" fontWeight="bold" fontSize="xl">
              Diary Notes
            </Text>
            <Flex direction="column" p="10px" w="full">
              {feedStore.feeds.map((feed) => (
                <MainFeed feed={feed} key={feed.id} onClick={() => {}} />
              ))}
            </Flex>
            <ScrollView horizontal={true}></ScrollView>
          </Flex>
        </Screen>
      </View>
    )
  },
)
