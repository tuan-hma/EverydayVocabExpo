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
  Text as NBText,
} from "native-base"

import {
  Button,
  Header,
  Screen,
  Text,
  AutoImage as Image,
  GradientBackground,
} from "../../components"

export interface SelectableBoxProps {
  state: "normal" | "selected"
  onClick: () => void
  children: JSX.Element
}

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function SelectableBox(props: SelectableBoxProps) {
  return (
    <Box m="2" alignItems="center">
      <Pressable onPress={() => props.onClick()}>
        {props.state === "selected" && (
          <Box
            borderWidth="0"
            borderBottomWidth="0"
            borderColor="orange.300"
            shadow="3"
            bg="white"
            p="0"
            rounded="18"
          >
            <Flex direction="row" p="4" pl="3" overflow="hidden" rounded="18">
              <GradientBackground colors={["#977dfe", "#6d4bf0"]}></GradientBackground>
              <Box mr="10px" mt="5px" p="4px" h="20px" w="20px" background="white" rounded="full">
                <CheckIcon size="3" />
              </Box>
              {props.children}
            </Flex>
          </Box>
        )}

        {props.state === "normal" && (
          <Box
            borderWidth="0"
            borderBottomWidth="0"
            borderColor="orange.300"
            shadow="1"
            bg="white"
            rounded="18"
          >
            <Flex direction="row" p="4" pl="42px" overflow="hidden" rounded="18">
              <GradientBackground colors={["#977dfe", "#6d4bf0"]}></GradientBackground>
              {props.children}
            </Flex>
          </Box>
        )}
      </Pressable>
    </Box>
  )
}
