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
  TextArea,
} from "native-base"
import { SelectableBox } from "../../components/selectable-box/selectable-box"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { EmojiImage } from "../../utils/emoji-image"
import { MainButton } from "../../components/main-button/main-button"
import { useStores } from "../../models"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[0],
}

export const YourdayTextScreen: FC<StackScreenProps<NavigatorParamList, "yourdayText">> = observer(
  ({ navigation }) => {
    const nextScreen = () => navigation.navigate("demo")
    const [selectedEmoji, setSelectedEmoji] = useState<any>(null)
    const [content, setContent] = useState<string>("")
    const { feedStore } = useStores()

    function EmotionGrid(icon: any) {
      const isSelected = icon === selectedEmoji
      return (
        <Box
          h="80px"
          w="80px"
          p="10px"
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
          <Image h="full" w="full" resizeMode="contain" source={icon} />
        </Box>
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
          <Flex direction="column" h="100%">
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
            <Flex flex="1" pl="5" pr="5" mt="5px" pb="20px">
              <VStack mt="10px" mb="10px">
                <HStack h="80px" space={3} maxW="100%" alignItems="center">
                  {EmotionGrid(EmojiImage.emoji1)}
                  <Text shadow="3" color="white" fontWeight="bold" fontSize="xl">
                    I'm feeling happy
                  </Text>
                </HStack>
              </VStack>
              <Text shadow="3" color="white" fontWeight="bold" fontSize="xl">
                What's going on ?
              </Text>
              <Box flex={1} alignItems="center" mt="3" w="100%" pb="20px">
                <TextArea
                  h="100%"
                  _hover={{
                    bg: "#00000020",
                  }}
                  _focus={{
                    bg: "#00000020",
                  }}
                  selectionColor={color.palette.text}
                  tintColor={color.palette.text}
                  borderWidth="0"
                  bg="#00000020"
                  focusOutlineColor="amber.300"
                  rounded="xl"
                  color={color.palette.text}
                  fontSize="xl"
                  value={content}
                  onChange={(e) => {
                    setContent(e.currentTarget.value)
                  }}
                />
              </Box>
              <MainButton
                title="Add to feed"
                onClick={() => {
                  feedStore.addFeed({
                    id: new Date().getTime(),
                    emotion: "emotion-1",
                    content: content,
                    image: "",
                  })
                  navigation.navigate("demoList")
                }}
              />
            </Flex>
          </Flex>
        </Screen>
      </View>
    )
  },
)
