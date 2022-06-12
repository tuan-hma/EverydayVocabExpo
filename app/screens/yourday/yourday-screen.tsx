import React, { FC, useState } from "react"
import { Animated, View, ViewStyle, TextStyle, ImageStyle, SafeAreaView } from "react-native"
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
  AspectRatio,
} from "native-base"
import { SelectableBox } from "../../components/selectable-box/selectable-box"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { EmojiImage } from "../../utils/emoji-image"
import { MainButton } from "../../components/main-button/main-button"
import { MoodModel, MoodUtil } from "../../models/mood"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[0],
}

const wavyBg = require("./wavy-bg.png")

export const YourdayScreen: FC<StackScreenProps<NavigatorParamList, "yourday">> = observer(
  ({ navigation }) => {
    const nextScreen = () => navigation.navigate("demo")
    const [selectedLevel, setSelectedLevel] = useState(0)
    const [selectedEmoji, setSelectedEmoji] = useState<MoodModel | null>(null)
    const moods = MoodUtil.getMoods()

    function EmotionGrid(mood: MoodModel) {
      const isSelected = mood === selectedEmoji
      return (
        <Pressable
          key={mood.code}
          alignItems="center"
          flexBasis="33.33%"
          onPress={() => setSelectedEmoji(mood)}
        >
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
                  {/* <Text fontSize="50px">{mood.emoji}</Text> */}
                  <Image h="full" w="full" resizeMode="contain" source={mood.image} alt="emoji" />
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
            <Text shadow="3" color="white" fontWeight="bold" fontSize="4xl">
              Your day
            </Text>
          </Flex>
          <Flex pl="5" pr="5" mt="20px">
            <Text shadow="3" color="white" fontWeight="bold" fontSize="xl">
              How is your feeling right now ?
            </Text>
            <VStack mt="10px">
              <HStack
                w="full"
                justifyContent="space-between"
                alignContent="space-between"
                flexWrap="wrap"
              >
                {moods.map((mood) => EmotionGrid(mood))}
              </HStack>
              <HStack h="130px" space={3} maxW="100%" justifyContent="space-around"></HStack>
              <HStack h="130px" space={3} maxW="100%" justifyContent="space-around"></HStack>
            </VStack>
            {selectedEmoji && (
              <MainButton
                title={`I'm ${selectedEmoji.name}`}
                onClick={() => {
                  navigation.navigate("yourdayText", {
                    mood: selectedEmoji,
                  })
                }}
              />
            )}
          </Flex>
        </Screen>
      </View>
    )
  },
)
