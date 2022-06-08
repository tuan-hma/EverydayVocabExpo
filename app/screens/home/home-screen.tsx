import React, { FC, useEffect, useRef, useState } from "react"
import { View, ViewStyle, TextStyle, ImageStyle, SafeAreaView } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Button, Header, Screen, Text, GradientBackground, AutoImage } from "../../components"
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
  Text as NBText,
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

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[0],
}
const TEXT: TextStyle = {
  color: color.palette.black,
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }

const wavyBg = require("./wavy-bg.png")
const welcome = require("./welcome.png")

export const HomeScreen: FC<StackScreenProps<NavigatorParamList, "home">> = observer(
  ({ navigation }) => {
    const notificationListener = useRef()
    const responseListener = useRef()
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
        <GradientBackground colors={["#fcf6ff", "#fcf6ff"]} />
        <ZStack>
          <Box w="full" h="900px" overflow="hidden">
            <GradientBackground colors={["#6d4bf0", "#977dfe"]}></GradientBackground>
          </Box>
          {/* <Image mt="150px" w="full" h="220px" source={wavyBg} /> */}
        </ZStack>

        <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
          <ZStack>
            <Image mt="130px" w="full" h="220px" source={wavyBg} />
            <Box mt="330px" w="full" h="900px" backgroundColor="#fcf6ff"></Box>
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
              <NBText color="white" fontWeight="bold" fontSize="3xl">
                Hi, welcome back!
              </NBText>
              <NBText color="white" fontSize="md">
                You've learnt for{" "}
                <NBText color="darkBlue.100" fontWeight="bold">
                  144
                </NBText>{" "}
                days. Keep going
              </NBText>
            </Flex>
            <Spacer />
            <Image shadow="3" mt="20px" alignSelf="center" w="60px" h="60px" source={welcome} />
          </HStack>

          <Flex p="5" mt="10px">
            <NBText color="white" fontWeight="bold" fontSize="xl">
              Today's Vocab
            </NBText>
            <VocabBox
              onClick={() => {
                // allowsNotificationsAsync()
                navigation.navigate("vocab")
              }}
              size="big"
              levelText={"Intermediate / N3"}
              hiragana={"せいひん"}
              kanji={"製品"}
              meaning={"product"}
              sample={"完成した製品を検査する"}
            />
          </Flex>

          <Flex mt="20px">
            <NBText pl="5" fontWeight="bold" fontSize="xl">
              Recent Vocabulary
            </NBText>
            <ScrollView horizontal={true}>
              <Flex direction="row">
                <VocabBox
                  onClick={() => {
                    registerForPushNotificationsAsync()
                  }}
                  size="small"
                  levelText={"Intermediate / N3"}
                  hiragana={"せいひん"}
                  kanji={"製品"}
                  meaning={"product"}
                  sample={"完成した製品を検査する"}
                />
                <VocabBox
                  onClick={() => {
                    schedulePushNotification().then(() => {
                      console.log("noti will send in 2s")
                    })
                  }}
                  size="small"
                  levelText={"Intermediate / N3"}
                  hiragana={"せいひん"}
                  kanji={"製品"}
                  meaning={"product"}
                  sample={"完成した製品を検査する"}
                />
                <VocabBox
                  onClick={() => {
                    // allowsNotificationsAsync()
                    navigation.navigate("vocab")
                  }}
                  size="small"
                  levelText={"Intermediate / N3"}
                  hiragana={"せいひん"}
                  kanji={"製品"}
                  meaning={"product"}
                  sample={"完成した製品を検査する"}
                />
                <VocabBox
                  onClick={() => {
                    // allowsNotificationsAsync()
                    navigation.navigate("vocab")
                  }}
                  size="small"
                  levelText={"Intermediate / N3"}
                  hiragana={"せいひん"}
                  kanji={"製品"}
                  meaning={"product"}
                  sample={"完成した製品を検査する"}
                />
              </Flex>
            </ScrollView>
          </Flex>
        </Screen>
      </View>
    )
  },
)
