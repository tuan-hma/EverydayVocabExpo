import React, { FC, useState } from "react"
import { View, ViewStyle, TextStyle, ImageStyle, SafeAreaView } from "react-native"
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
} from "native-base"
import { SelectableBox } from "../../components/selectable-box/selectable-box"
import { MaterialCommunityIcons } from "@expo/vector-icons"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[0],
}
const TEXT: TextStyle = {
  color: color.palette.text,
  fontFamily: typography.primary,
  fontSize: 30,
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
}
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
const TITLE_WRAPPER: TextStyle = {
  ...TEXT,
  textAlign: "left",
  marginTop: 30,
}
const TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "left",
}
const BOWSER: ImageStyle = {
  alignSelf: "center",
  marginVertical: spacing[5],
  maxWidth: "100%",
  width: 343,
  height: 230,
}
const CONTENT: TextStyle = {
  ...TEXT,
  color: "#BAB6C8",
  fontSize: 15,
  lineHeight: 22,
  marginBottom: spacing[5],
}

const CONTINUE_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}
const FOOTER: ViewStyle = { backgroundColor: "#fdfbfb" }
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
}

const wavyBg = require("./wavy-bg.png")

function LevelButton(title: string, tag: string, description: string) {
  return (
    <Box w="220px">
      <HStack alignItems="center">
        <NBText color="white" fontWeight="bold" fontSize="xl">
          {title}
        </NBText>
        <Spacer />
        <Badge
          background="white"
          _text={{
            color: "#6d4bf0",
          }}
          variant="solid"
          rounded="full"
        >
          {tag}
        </Badge>
      </HStack>

      <NBText mt="2" fontSize="sm" color="white">
        {description}
      </NBText>
    </Box>
  )
}

export const YourdayScreen: FC<StackScreenProps<NavigatorParamList, "yourday">> = observer(
  ({ navigation }) => {
    const nextScreen = () => navigation.navigate("demo")
    const [selectedLevel, setSelectedLevel] = useState(0)

    return (
      <View testID="WelcomeScreen" style={FULL}>
        <GradientBackground colors={[color.palette.background, color.palette.background]} />

        <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
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
            <NBText color="white" fontWeight="bold" fontSize="4xl">
              Your day
            </NBText>
            <Text style={TEXT} preset="header" tx="demoScreen.title" />
          </Flex>
          <Flex pl="5" pr="5" mt="20px">
            <NBText color="white" fontWeight="bold" fontSize="xl">
              How is your feeling right now ?
            </NBText>
            <VStack mt="10px">
              <SelectableBox
                onClick={() => {
                  setSelectedLevel(0)
                }}
                state={selectedLevel === 0 ? "selected" : "normal"}
              >
                {LevelButton("N4 - N5", "Beginner", "Basic, essensial vocabulary")}
              </SelectableBox>

              <SelectableBox
                onClick={() => {
                  setSelectedLevel(1)
                }}
                state={selectedLevel === 1 ? "selected" : "normal"}
              >
                {LevelButton("N3 - N4", "Intermediate", "Daily common usage vocabulary")}
              </SelectableBox>

              <SelectableBox
                onClick={() => {
                  setSelectedLevel(2)
                }}
                state={selectedLevel === 2 ? "selected" : "normal"}
              >
                {LevelButton("N1 - N2", "Advance", "Academic vocabulary")}
              </SelectableBox>
            </VStack>
          </Flex>
        </Screen>
      </View>
    )
  },
)
