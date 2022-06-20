import * as React from "react"
import { Box, Pressable, Text, Image } from "native-base"
import { color } from "../../theme"

export interface CommonButtonProps {
  onClick: () => void
  icon?: any
  text?: string
}

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function CommonButton(props: CommonButtonProps) {
  return (
    <Pressable
      onPress={() => {
        props.onClick()
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
                colors: [color.palette.colorful1, color.palette.colorful2],
                start: [1, 0],
                end: [0, 1],
              },
            }}
            // w="150px"
            // h="62px"
            rounded="20px"
          >
            {props.icon && (
              <Box w="40px" shadow="4">
                <Image w="40px" h="40px" source={props.icon} alt="icon" />
              </Box>
            )}

            {props.text && (
              <Text
                ml="10px"
                shadow="9"
                fontSize="md"
                fontWeight="bold"
                color="white"
                textAlign="center"
              >
                {props.text}
              </Text>
            )}
          </Box>
        )
      }}
    </Pressable>
  )
}
