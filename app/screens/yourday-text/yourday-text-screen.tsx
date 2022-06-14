import React, { FC, useState } from "react"
import { Animated, View, ViewStyle, TextStyle, ImageStyle, SafeAreaView } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Header, Screen, GradientBackground } from "../../components"
import { color, spacing, typography } from "../../theme"
import { NavigatorParamList } from "../../navigators"
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
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

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[0],
}

export const YourdayTextScreen: FC<StackScreenProps<NavigatorParamList, "yourdayText">> = observer(
  ({ navigation, route }) => {
    const selectedMood: MoodModel = route.params.mood
    const nextScreen = () => navigation.navigate("demo")
    const [image, setImage] = useState(null)
    const [content, setContent] = useState("")
    const { feedStore } = useStores()

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

      console.log(result)

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
          <Flex direction="column" h="100%">
            <Flex pr="20px" direction="row" justifyContent="space-between" alignItems="center">
              <Flex mt="10px" direction="row" alignItems="center">
                <IconButton
                  borderRadius="full"
                  _icon={{
                    color: "white",
                    size: "md",
                  }}
                  w="40px"
                  h="40px"
                  onPress={() => navigation.navigate("yourday")}
                  icon={<ChevronLeftIcon h="60px" w="60px" />}
                ></IconButton>
                <VStack>
                  <HStack h="80px" space={3} maxW="100%" alignItems="center">
                    {EmotionGrid(selectedMood.image)}
                    <Text shadow="3" color="white" fontWeight="bold" fontSize="2xl">
                      {selectedMood.name}
                    </Text>
                  </HStack>
                </VStack>
              </Flex>
              <MainButton
                title="+ Create"
                onClick={() => {
                  console.log(content)
                  feedStore.addFeed({
                    id: new Date().getTime(),
                    emotion: selectedMood.code,
                    content: content,
                    image: image?.uri ?? "",
                    imageRatio: image ? image.width / image.height : 1,
                  })
                  navigation.navigate("home")
                }}
              />
            </Flex>

            <Flex flex="1" pl="5" pr="5" pb="20px">
              <Flex direction="row" alignItems="flex-end" justifyContent="space-between">
                <Text shadow="3" color="white" fontWeight="bold" fontSize="xl">
                  What's going on ?
                </Text>
                <HStack>
                  <IconButton
                    mr="20px"
                    // borderRadius="full"
                    p="0"
                    onPress={() => navigation.navigate("home")}
                    icon={<Feather name="camera" size={30} color={color.palette.mildText} />}
                  ></IconButton>
                  <IconButton
                    // borderRadius="full"
                    p="0"
                    onPress={() => pickImage()}
                    icon={<Feather name="image" size={30} color={color.palette.mildText} />}
                  ></IconButton>
                </HStack>
              </Flex>

              <Box flex={1} alignItems="flex-start" mt="3" w="100%" pb="0px">
                <TextArea
                  mb="5px"
                  flexGrow="1"
                  _hover={{
                    bg: "#00000020",
                  }}
                  _focus={{
                    bg: "#00000020",
                  }}
                  selectionColor={color.palette.text}
                  borderWidth="0"
                  bg="#00000020"
                  focusOutlineColor="amber.300"
                  rounded="xl"
                  color={color.palette.text}
                  fontSize="xl"
                  value={content}
                  onChangeText={(text) => {
                    setContent(text)
                  }}
                />
                {image && (
                  <ZStack h="150px" w={`${(150 * image.width) / image.height}px`}>
                    <Image
                      borderRadius={10}
                      source={{ uri: image.uri }}
                      w="full"
                      resizeMode="contain"
                      h="full"
                    />
                    <Box bg="#00000090" p="5px" m="5px" rounded="10px">
                      <IconButton
                        // borderRadius="full"
                        p="0"
                        onPress={() => setImage(null)}
                        icon={<Feather name="trash" size={24} color="white" />}
                      ></IconButton>
                    </Box>
                  </ZStack>
                )}
              </Box>
            </Flex>
          </Flex>
        </Screen>
      </View>
    )
  },
)
