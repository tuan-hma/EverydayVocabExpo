import * as React from "react"
import { Box, HStack, Pressable, Text, Image, ScrollView } from "native-base"
import { FeedSnapshot } from "../../models/feed-store/feed"
import { color } from "../../theme"
import { EmojiImage } from "../../utils/emoji-image"
import { MoodModel, MoodUtil } from "../../models/mood"
import { useStores } from "../../models"
import { ColorThemeUtil } from "../../models/colorTheme"
import { SettingOptionIdDefine } from "../../models/setting-option-store/setting-option"

export interface MoodSumProps {
  feeds: FeedSnapshot[]
}

export interface MoodSumItem {
  mood: MoodModel
  count: number
}

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function MoodSum(props: MoodSumProps) {
  const { feedStore, settingOptionStore } = useStores()
  const colorTheme = ColorThemeUtil.getColorThemeById(
    settingOptionStore.getSettingOption(SettingOptionIdDefine.colorTheme),
  )
  const getMoodSumResult = (feeds: FeedSnapshot[]): MoodSumItem[] => {
    const moods = MoodUtil.getMoods()
    let result: MoodSumItem[] = moods.map((m) => ({
      mood: m,
      count: 0,
    }))
    feeds.forEach((f) => {
      try {
        result.find((mood) => mood.mood.code === f.emotion).count += 1
      } catch {}
    })
    result = result.filter((a) => a.count !== 0)
    result.sort((a, b) => -a.count + b.count)
    return result
  }
  return (
    <ScrollView showsHorizontalScrollIndicator={false} alwaysBounceVertical={false} horizontal>
      <HStack space="sm">
        {getMoodSumResult(props.feeds).map((result) => (
          <Box
            shouldRasterizeIOS
            renderToHardwareTextureAndroid
            key={"mood-sum-" + result.mood.code}
            flexDirection="row"
            p="5px"
            bg={colorTheme.palette.backgroundSelected}
            rounded="10px"
          >
            <Box
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
            >
              <Image
                w="20px"
                h="20px"
                resizeMode="contain"
                source={result.mood.image}
                alt={result.mood.code}
              />
            </Box>
            <Text ml="5px" fontWeight="bold" color={colorTheme.palette.text}>
              x{result.count}
            </Text>
          </Box>
        ))}
      </HStack>
    </ScrollView>
  )
}
