import * as React from "react"
import { Box, Pressable, Text } from "native-base"
import * as Haptics from "expo-haptics"
import { useStores } from "../../models"
import { ColorThemeUtil } from "../../models/colorTheme"
import { SettingOptionIdDefine } from "../../models/setting-option-store/setting-option"

export interface MainButtonProps {
  title: string
  onClick: () => void
}

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function MainButton(props: MainButtonProps) {
  const { feedStore, settingOptionStore } = useStores()
  const colorTheme = ColorThemeUtil.getColorThemeById(
    settingOptionStore.getSettingOption(SettingOptionIdDefine.colorTheme),
  )
  return (
    <Pressable
      shadow="3"
      onPress={() => {
        Haptics.selectionAsync()
        props.onClick()
      }}
    >
      {({ isHovered, isFocused, isPressed }) => {
        return (
          <Box
            maxW="96"
            // borderWidth="2"
            borderColor="#8c42f9"
            bg={{
              linearGradient: {
                colors: ["#8c42f9", "#6f36fd", "#c55bf6"],
                start: [0, 0],
                end: [1, 1],
                location: [0, 0.2, 0.3],
              },
            }}
            p="10px"
            rounded="20"
            style={{
              transform: [
                {
                  scale: isPressed ? 0.96 : 1,
                },
              ],
            }}
          >
            <Text
              shadow="3"
              fontSize="2xl"
              fontWeight="bold"
              color="white"
              w="100%"
              textAlign="center"
            >
              {props.title}
            </Text>
          </Box>
        )
      }}
    </Pressable>
  )
}
