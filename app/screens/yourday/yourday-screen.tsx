import React, { FC, useState } from "react"
import { Animated, View, ViewStyle, TextStyle, ImageStyle, SafeAreaView } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Button, Header, Screen, Text, GradientBackground } from "../../components"
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
  AspectRatio,
} from "native-base"
import { SelectableBox } from "../../components/selectable-box/selectable-box"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { EmojiImage } from "../../utils/emoji-image"
import { MainButton } from "../../components/main-button/main-button"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[0],
}

const BOLD: TextStyle = { fontWeight: "bold" }

const wavyBg = require("./wavy-bg.png")

export const YourdayScreen: FC<StackScreenProps<NavigatorParamList, "yourday">> = observer(
  ({ navigation }) => {
    const nextScreen = () => navigation.navigate("demo")
    const [selectedLevel, setSelectedLevel] = useState(0)
    const [selectedEmoji, setSelectedEmoji] = useState<any>(null)

    function EmotionGrid(icon: any) {
      const isSelected = icon === selectedEmoji
      return (
        <Pressable onPress={() => setSelectedEmoji(icon)}>
          {({ isHovered, isFocused, isPressed }) => {
            return (
              <Box
                style={{
                  transform: [
                    {
                      scale: isPressed ? 0.85 : 1,
                    },
                  ],
                }}
                w="100px"
                h="100px"
                background={isSelected ? color.palette.backgroundSelected : color.transparent}
                borderRadius="30px"
                p="5px"
                alignItems="center"
                borderWidth={isSelected ? "3px" : 0}
                borderColor="#ffffff30"
              >
                <Box
                  h="full"
                  w="full"
                  p="10px"
                  shadow={
                    isSelected
                      ? {
                          shadowColor: "#f88b30",
                          shadowOffset: {
                            width: 0,
                            height: 0,
                          },
                          shadowOpacity: 0.4,
                          shadowRadius: 10,
                          elevation: 10,
                        }
                      : 0
                  }
                  background="transparent"
                >
                  <Image h="full" w="full" resizeMode="contain" source={icon} />
                </Box>
              </Box>
            )
          }}
        </Pressable>
      )
    }

    return (
      <View testID="WelcomeScreen" style={FULL}>
        <GradientBackground colors={[color.palette.background, color.palette.background]} />

        <Screen style={CONTAINER} preset="fixed" backgroundColor={color.transparent}>
          {/* <ZStack>
            <Image mt="30px" w="full" h="220px" source={wavyBg} />
            <Box mt="230px" w="full" h="900px" backgroundColor="#fcf6ff"></Box>
          </ZStack> */}
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
            <NBText shadow="3" color="white" fontWeight="bold" fontSize="4xl">
              Your day
            </NBText>
          </Flex>
          <Flex pl="5" pr="5" mt="20px">
            <NBText shadow="3" color="white" fontWeight="bold" fontSize="xl">
              How is your feeling right now ?
            </NBText>
            <VStack mt="10px">
              <HStack h="130px" space={3} maxW="100%" justifyContent="space-around">
                {EmotionGrid(EmojiImage.emoji1)}
                {EmotionGrid(EmojiImage.emoji2)}
                {EmotionGrid(EmojiImage.emoji3)}
              </HStack>
              <HStack h="130px" space={3} maxW="100%" justifyContent="space-around">
                {EmotionGrid(EmojiImage.emoji4)}
                {EmotionGrid(EmojiImage.emoji5)}
                {EmotionGrid(EmojiImage.emoji6)}
              </HStack>
              <HStack h="130px" space={3} maxW="100%" justifyContent="space-around">
                {EmotionGrid(EmojiImage.emoji7)}
                {EmotionGrid(EmojiImage.emoji8)}
                {EmotionGrid(EmojiImage.emoji9)}
              </HStack>
            </VStack>
            <MainButton
              title="Continue"
              onClick={() => {
                navigation.navigate("yourdayText")
              }}
            />
          </Flex>
        </Screen>
      </View>
    )
  },
)
