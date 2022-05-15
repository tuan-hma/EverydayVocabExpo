import React, { FC, useState } from "react"
import { View, ViewStyle, TextStyle, ImageStyle, SafeAreaView } from "react-native"
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
} from "native-base"
import { SelectableBox } from "../../components/selectable-box/selectable-box"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { HighlightText } from "../../components/highlight-text/highlight-text"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[0],
}

const wavyBg = require("../home/wavy-bg.png")
const starIcon = require("./star-icon.png")
const dictionaryIcon = require("./book-icon.png")
const pencilIcon = require("./pencil-icon.png")

function LevelButton(title: string, tag: string, description: string) {
  return (
    <Box w="220px">
      <HStack alignItems="center">
        <Text color="white" fontWeight="bold" fontSize="xl">
          {title}
        </Text>
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

      <Text mt="2" fontSize="sm" color="white">
        {description}
      </Text>
    </Box>
  )
}

export interface Vocab {
  levelText: string
  additional: string // を,が動詞など
  hiragana: string
  kanji: string
  meaning: string
  usages: Usage[]
}

interface Usage {
  samples: string[]
  combines: string[]
  groups: string[]
  synonyms: string[]
  antonyms: string[]
}

export const VocabScreen: FC<StackScreenProps<NavigatorParamList, "vocab">> = observer(
  ({ navigation }) => {
    const nextScreen = () => navigation.navigate("demo")
    const [selectedLevel, setSelectedLevel] = useState(0)

    const [vocab, setVocab] = useState<Vocab | null>({
      levelText: "Advance / N2",
      hiragana: "かんじょう",
      kanji: "勘定",
      additional: "を勘定する",
      meaning: "calculation, payment, bill, consideration",
      usages: [
        {
          samples: ["勘定を済ませて帰る", "（飲食店で）「お勘定、お願いします」"],
          combines: ["__があう/合わない"],
          synonyms: ["会計"],
          groups: [],
          antonyms: [],
        },
        {
          samples: [
            "{金/人数 ・・・}を勘定する",
            "今月の支出をチェックしているのだが、何度やっても勘定が合わない",
          ],
          combines: ["__があう/合わない"],
          synonyms: ["計算"],
          groups: [],
          antonyms: [],
        },
      ],
    })

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
            <Image mt="30px" w="full" h="220px" source={wavyBg} />
            <Box mt="230px" w="full" h="900px" backgroundColor="#fcf6ff"></Box>
          </ZStack>
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
            <Text color="white" fontWeight="bold" fontSize="4xl">
              Word
            </Text>
          </Flex>
          <HStack>
            <Badge
              ml="10"
              h="20px"
              background="white"
              _text={{
                fontSize: "10px",
                color: "#6d4bf0",
              }}
              variant="solid"
              rounded="full"
            >
              {vocab.levelText}
            </Badge>
          </HStack>

          <Flex pl="5" pr="5" mt="20px">
            <VStack mt="10px">
              <Box m="2" alignItems="center">
                <Pressable onPress={() => {}}>
                  <Box
                    borderWidth="0"
                    borderBottomWidth="0"
                    borderColor="orange.300"
                    shadow="3"
                    bg="white"
                    p="0"
                    rounded="18"
                  >
                    <Flex direction="row" p="4" pl="0" overflow="hidden" rounded="18">
                      <GradientBackground
                        start={[0, 0]}
                        end={[1, 1]}
                        colors={["#9c79ff", "#7747fe"]}
                      ></GradientBackground>
                      <Flex alignItems="center" ml="3" direction="column" w={"120px"}>
                        <HStack>
                          <Flex w="full" alignItems="center" direction="column">
                            <Text fontWeight="bold" color="white">
                              {vocab.hiragana}
                            </Text>
                            <Text fontWeight="bold" color="white" fontSize="3xl">
                              {vocab.kanji}
                            </Text>
                            <Text fontWeight="bold" color="white">
                              {vocab.additional}
                            </Text>
                          </Flex>

                          <Spacer />
                        </HStack>
                        {/* <Text mt="20px" color="white">
                {props.sample}
              </Text> */}
                      </Flex>
                    </Flex>
                  </Box>
                </Pressable>
              </Box>

              <Text alignSelf="center">{vocab.meaning}</Text>
              <Flex mt="20px" shadow="0" flexDirection="row" alignItems="center">
                <Image mr="10px" source={dictionaryIcon} h="35px" w="35px" />
                <HStack p="5px" rounded="full" overflow="hidden" alignItems="center">
                  <GradientBackground
                    start={[0, 0]}
                    end={[1, 1]}
                    colors={["#e65c00", "#ff9e5b"]}
                  ></GradientBackground>

                  <Text ml="2" mr="2" color="white" fontWeight="bold">
                    Meanings and Usages
                  </Text>
                </HStack>
              </Flex>

              {vocab.usages.map((usage, index) => (
                <Flex mt="10px" mb="10px" key={`usage_${index}`}>
                  <HStack alignItems="center">
                    {/* <Image source={starIcon} h="25px" w="25px" /> */}

                    <Box w="100%" m="2">
                      <Pressable onPress={() => {}}>
                        <Box
                          borderWidth="0"
                          borderBottomWidth="0"
                          borderColor="orange.300"
                          shadow="3"
                          bg="white"
                          p="0"
                          rounded="18"
                          w="100%"
                        >
                          <Flex direction="row" pt="4" pb="4" overflow="hidden" rounded="18">
                            <GradientBackground
                              start={[0, 0]}
                              end={[1, 1]}
                              colors={["#9c79ff", "#7747fe"]}
                            ></GradientBackground>
                            <Flex ml="3" direction="column">
                              <HStack alignItems="center">
                                <Flex direction="column">
                                  <HStack>
                                    <Text fontWeight="bold" color="white">
                                      Meaning No.
                                      {index + 1}
                                    </Text>
                                    <Spacer />
                                    {/* <Box
                                      rounded="full"
                                      h="35px"
                                      w="35px"
                                      background="white"
                                      p="5px"
                                      mr="5px"
                                    >
                                      <Image w="25px" h="25px" source={pencilIcon} />
                                    </Box> */}
                                  </HStack>

                                  <Badge
                                    w="65px"
                                    background="white"
                                    _text={{
                                      fontSize: "10px",
                                      color: "#6d4bf0",
                                    }}
                                    variant="solid"
                                    rounded="5px"
                                    mb="5px"
                                  >
                                    Samples
                                  </Badge>
                                  {usage.samples.map((sample, index) => (
                                    <HighlightText
                                      content={`・${sample}`}
                                      fontWeight="normal"
                                      color="white"
                                      key={`sample_${index}`}
                                      highlightWord={vocab.kanji}
                                      fontSize={"14px"}
                                    ></HighlightText>
                                  ))}
                                  {usage.combines.length > 0 && (
                                    <>
                                      <Badge
                                        w="70px"
                                        background="white"
                                        _text={{
                                          fontSize: "10px",
                                          color: "#6d4bf0",
                                        }}
                                        variant="solid"
                                        rounded="5px"
                                        mb="5px"
                                        mt="10px"
                                      >
                                        Combines
                                      </Badge>
                                      {usage.combines.map((combine, index) => (
                                        <HighlightText
                                          content={`・${combine.replaceAll("__", vocab.kanji)}`}
                                          fontWeight="normal"
                                          color="white"
                                          key={`sample_${index}`}
                                          highlightWord={vocab.kanji}
                                          fontSize={"14px"}
                                        ></HighlightText>
                                      ))}
                                    </>
                                  )}
                                  {usage.synonyms.length > 0 && (
                                    <>
                                      <Badge
                                        w="70px"
                                        background="white"
                                        _text={{
                                          fontSize: "10px",
                                          color: "#6d4bf0",
                                        }}
                                        variant="solid"
                                        rounded="5px"
                                        mb="5px"
                                        mt="10px"
                                      >
                                        Synonyms
                                      </Badge>
                                      {usage.synonyms.map((combine, index) => (
                                        <HighlightText
                                          content={`・${combine.replaceAll("__", vocab.kanji)}`}
                                          fontWeight="bold"
                                          color="white"
                                          key={`sample_${index}`}
                                          highlightWord={vocab.kanji}
                                          fontSize={"14px"}
                                        ></HighlightText>
                                      ))}
                                    </>
                                  )}
                                </Flex>

                                <Spacer />
                              </HStack>
                              {/* <Text mt="20px" color="white">
                {props.sample}
              </Text> */}
                            </Flex>
                          </Flex>
                        </Box>
                      </Pressable>
                    </Box>
                  </HStack>
                </Flex>
              ))}
            </VStack>
          </Flex>
        </Screen>
      </View>
    )
  },
)
