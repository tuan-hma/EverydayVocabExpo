import * as React from "react"
import { Box, Flex, Pressable, Text, Image } from "native-base"
import { MoodModel, MoodUtil } from "../../models/mood"
import { EmojiImage } from "../../utils/emoji-image"
import { color } from "../../theme"
import { FeedSnapshot } from "../../models/feed-store/feed"
import moment from "moment"

export interface MainFeedProps {
  feed: FeedSnapshot
  onClick: () => void
}

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function MainFeed(props: MainFeedProps) {
  const mood = MoodUtil.getMood(props.feed.emotion)
  return (
    <Flex direction="row">
      <Text color={color.palette.mildText} fontSize="md" fontWeight="bold" mr="20px">
        {moment(props.feed.id).format("HH:mm")}
      </Text>
      <Flex
        rounded="full"
        w="5px"
        h="full"
        bg={color.palette.backgroundSelected}
        mr="20px"
        alignItems="center"
      >
        <Box
          w="20px"
          h="20px"
          bg={color.palette.mildText}
          borderWidth="2px"
          borderColor={color.palette.milderText}
          rounded="full"
        ></Box>
      </Flex>
      <Pressable flexGrow="1" shadow="3" onPress={props.onClick}>
        {({ isHovered, isFocused, isPressed }) => {
          return (
            <Box
              shadow="3"
              w="full"
              rounded="20px"
              borderWidth="2px"
              borderColor="#48456730"
              p="8px"
              bg={{
                linearGradient: {
                  colors: ["#474165", "#35334d"],
                  start: [1, 0],
                  end: [0, 1],
                },
              }}
              mb="10px"
            >
              <Flex direction="row" justifyContent="space-between">
                {/* left item */}
                <Flex flexGrow="1" flexShrink="2" direction="column">
                  <Text
                    mb="10px"
                    color={color.palette.milderText}
                    fontSize="2xl"
                    fontWeight="bold"
                    shadow="6"
                  >
                    {mood?.name}
                  </Text>
                  <Text
                    shadow="3"
                    pr="10px"
                    color={color.palette.mildText}
                    fontSize="lg"
                    fontWeight="bold"
                  >
                    {props.feed.content}
                  </Text>
                </Flex>
                {/* right item */}
                <Flex justifyContent="space-between" direction="column" alignItems="flex-end">
                  <Box bg="#524b74" rounded="xl">
                    <Box
                      h="40px"
                      w="40px"
                      p="5px"
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
                      <Image
                        h="full"
                        w="full"
                        resizeMode="contain"
                        source={mood?.image}
                        alt="emoji"
                      />
                    </Box>
                  </Box>
                </Flex>
              </Flex>
            </Box>
          )
        }}
      </Pressable>
    </Flex>
  )
}
