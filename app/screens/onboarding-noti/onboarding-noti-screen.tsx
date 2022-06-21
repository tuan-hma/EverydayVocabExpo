import React, { FC, useEffect, useState } from "react"
import { Animated, View, ViewStyle, TextStyle, ImageStyle, SafeAreaView } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Header, Screen, GradientBackground } from "../../components"
import { color, spacing, typography } from "../../theme"
import { NavigatorParamList } from "../../navigators"
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import LottieView from "lottie-react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
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
  AspectRatio,
  TextArea,
} from "native-base"
import { CommonButton } from "../../components/common-button/common-button"
import { SettingState } from "../../utils/setting-state"
import { aquireNotifyPermission } from "../../utils/notification"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[0],
}

export const OnboardingNotiScreen: FC<
  StackScreenProps<NavigatorParamList, "onboardingNoti">
> = observer(({ navigation, route }) => {
  const [hasPermission, setHasPermission] = useState(null)

  return (
    <View testID="WelcomeScreen" style={FULL}>
      <GradientBackground colors={[color.palette.background, color.palette.background]} />

      <Screen style={CONTAINER} preset="fixed" backgroundColor={color.transparent}>
        {/* <ZStack>
            <Image mt="30px" w="full" h="220px" source={wavyBg} />
            <Box mt="230px" w="full" h="900px" backgroundColor="#fcf6ff"></Box>
          </ZStack> */}
        <Flex pl="10px" pr="10px" justifyContent="center" direction="column" h="100%">
          <AspectRatio w="100%" ratio={4 / 3}>
            <Box w="100%" shadow="3">
              <ZStack w="full" h="full">
                <Image
                  source={require("../home/cloud-bg.png")}
                  alt="cloud"
                  w="full"
                  h="full"
                  resizeMode="contain"
                />
                <LottieView
                  autoPlay
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    flex: 1,
                  }}
                  // Find more Lottie files at https://lottiefiles.com/featured
                  source={require("./notification.json")}
                />
              </ZStack>
            </Box>
          </AspectRatio>
          <VStack alignSelf="center" mt="30px" mb="50px">
            <Text
              textAlign="center"
              mb="20px"
              color={color.palette.text}
              fontWeight="bold"
              fontSize="3xl"
            >
              📣 Notifications
            </Text>
            <Text ml="30px" mr="30px" mb="20px" color={color.palette.text} fontSize="lg">
              We will send notification everyday, summary up your daily journal
            </Text>
            <HStack alignSelf="center">
              <Box shadow="9" pt="20px" pb="20px" pr="10px" alignSelf="center">
                <CommonButton
                  onClick={() => {
                    aquireNotifyPermission().then(() => {
                      navigation.navigate("home")
                    })
                  }}
                  text="Yes, Set it up  👌"
                />
              </Box>
              <Box shadow="9" pt="20px" pb="20px" pr="10px" alignSelf="center">
                <CommonButton
                  onClick={() => {
                    SettingState.setIsDailySummary(false)
                    navigation.navigate("home")
                  }}
                  text="Nah  💦"
                />
              </Box>
            </HStack>
          </VStack>
        </Flex>
      </Screen>
    </View>
  )
})
