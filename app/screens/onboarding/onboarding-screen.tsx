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
import { Camera } from "expo-camera"
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
import { SelectableBox } from "../../components/selectable-box/selectable-box"

import { EmojiImage } from "../../utils/emoji-image"
import { MainButton } from "../../components/main-button/main-button"
import { useStores } from "../../models"
import { MoodModel } from "../../models/mood"

const addIcon = require("../home/add-icon.png")

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[0],
}

export const OnboardingScreen: FC<StackScreenProps<NavigatorParamList, "onboarding">> = observer(
  ({ navigation, route }) => {
    const nextScreen = () => navigation.navigate("demo")
    const [image, setImage] = useState(null)
    const [content, setContent] = useState("")
    const [hasPermission, setHasPermission] = useState(null)
    const { feedStore } = useStores()

    const onImageTaken = (imageData: any) => {
      setImage(imageData)
    }

    function EmotionGrid(icon: any) {
      return (
        <Box
          h="50px"
          w="50px"
          p="2px"
          shadow={{
            shadowColor: "#f88b30",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.4,
            shadowRadius: 10,
            elevation: 10,
          }}
          background="transparent"
        >
          <Image h="full" w="full" resizeMode="contain" source={icon} alt="emoji" />
        </Box>
      )
    }

    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 0.8,
      })

      if (!result.cancelled) {
        setImage(result)
      }
    }

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
                    source={require("./feeling.json")}
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
                Hi 👋 , Welcome to{"\n"}Moody Diary
              </Text>
              <Text mb="20px" color={color.palette.text} fontSize="lg">
                With Moody Diary you can{"\n"}
                <Text bold>note down 📝 and track{"\n"}your whole day</Text> activities 🎮 🏀 🧘
                {"\n"}
                along with your emotion 😼,{"\n"}cool, isn't it? 😎
              </Text>

              <Text mb="20px" color={color.palette.text} fontSize="lg">
                🤞 May your notes serve you well 🤞
              </Text>
              <Text mb="20px" color={color.palette.text} fontSize="lg">
                🤖 NOTICE 🤖{"\n"}The app is under active development, new features will come
                regularly
              </Text>
              <Box shadow="9" pt="20px" pb="20px" pr="10px" alignSelf="center">
                <Pressable
                  onPress={() => {
                    navigation.navigate("home")
                  }}
                >
                  {({ isHovered, isFocused, isPressed }) => {
                    return (
                      <Box
                        renderToHardwareTextureAndroid
                        shouldRasterizeIOS
                        shadow="9"
                        flexDirection="row"
                        alignItems="center"
                        p="10px"
                        style={{
                          transform: [
                            {
                              scale: isPressed ? 0.96 : 1,
                            },
                          ],
                        }}
                        bg={{
                          linearGradient: {
                            colors: ["#926fef", "#7751e9"],
                            start: [1, 0],
                            end: [0, 1],
                          },
                        }}
                        w="190px"
                        h="62px"
                        rounded="30px"
                      >
                        <Box w="40px" shadow="4">
                          <Feather name="arrow-right-circle" size={30} color={color.palette.text} />
                        </Box>

                        <Text
                          shadow="9"
                          fontSize="lg"
                          fontWeight="bold"
                          color="white"
                          textAlign="center"
                        >
                          🚀 Start now
                        </Text>
                      </Box>
                    )
                  }}
                </Pressable>
              </Box>
            </VStack>
          </Flex>
        </Screen>
      </View>
    )
  },
)
