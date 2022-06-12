import { EmojiImage } from "../utils/emoji-image"

export interface MoodModel {
  code: string
  name: string
  image: any
  emoji: string
}

export class MoodUtil {
  static moods: MoodModel[] = [
    {
      code: "funny",
      name: "Having Fun",
      image: EmojiImage.emoji1,
      emoji: "🥺",
    },
    {
      code: "excited",
      name: "Excited",
      image: EmojiImage.emoji2,
      emoji: "🥺",
    },
    {
      code: "love",
      name: "Feeling Love",
      image: EmojiImage.emoji3,
      emoji: "🥺",
    },
    {
      code: "amuse",
      name: "Amusing",
      image: EmojiImage.emoji4,
      emoji: "🥺",
    },
    {
      code: "disappoint",
      name: "Disappointing",
      image: EmojiImage.emoji5,
      emoji: "🥺",
    },
    {
      code: "sad",
      name: "Feeling Sad",
      image: EmojiImage.emoji6,
      emoji: "🥺",
    },
    {
      code: "angry",
      name: "Angry",
      image: EmojiImage.emoji7,
      emoji: "🥺",
    },
    {
      code: "confident",
      name: "Feeling Confident",
      image: EmojiImage.emoji8,
      emoji: "🥺",
    },
    {
      code: "happy",
      name: "Feeling Happy",
      image: EmojiImage.emoji9,
      emoji: "🥺",
    },
  ]

  public static getMoods(): MoodModel[] {
    return MoodUtil.moods
  }

  public static getMood(code: string): MoodModel | null {
    return MoodUtil.moods.find((a) => a.code === code) ?? null
  }
}
