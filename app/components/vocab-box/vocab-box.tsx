import * as React from "react"
import {
  Flex,
  Button as NBButton,
  VStack,
  HStack,
  Radio,
  Box,
  Pressable,
  Badge,
  Spacer,
  CheckIcon,
  Text,
} from "native-base"

import { Button, Header, Screen, AutoImage as Image, GradientBackground } from ".."

export interface VocabBoxProps {
  levelText: string
  hiragana: string
  kanji: string
  meaning: string
  sample: string
  size: "big" | "small"
}

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function VocabBox(props: VocabBoxProps) {
  return (
    <Box m="2" alignItems="center">
      <Pressable onPress={() => props.onClick()}>
        <Box
          borderWidth="0"
          borderBottomWidth="0"
          borderColor="orange.300"
          shadow={{
            shadowColor: "#7747fe",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.4,
            shadowRadius: 2.62,
            elevation: 4,
          }}
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
            <Flex ml="3" direction="column" w={props.size === "big" ? "220px" : "120px"}>
              <HStack>
                <Flex direction="column">
                  <Text color="white">{props.hiragana}</Text>
                  <Text fontWeight="bold" color="white" fontSize="3xl">
                    {props.kanji}
                  </Text>
                  <Badge
                    pl="4"
                    pr="4"
                    minW="100px"
                    ml="-4"
                    background="white"
                    _text={{
                      fontSize: "12px",
                      color: "#6d4bf0",
                    }}
                    variant="solid"
                    rounded="sm"
                  >
                    {props.meaning}
                  </Badge>
                </Flex>

                <Spacer />
                {props.size === "big" && (
                  <Badge
                    h="20px"
                    background="white"
                    _text={{
                      fontSize: "10px",
                      color: "#6d4bf0",
                    }}
                    variant="solid"
                    rounded="full"
                  >
                    {props.levelText}
                  </Badge>
                )}
              </HStack>
              {/* <Text mt="20px" color="white">
                {props.sample}
              </Text> */}
            </Flex>
          </Flex>
        </Box>
      </Pressable>
    </Box>
  )
}
