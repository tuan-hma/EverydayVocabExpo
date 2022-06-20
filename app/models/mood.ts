import { EmojiImage } from "../utils/emoji-image"

export interface MoodModel {
  code: string
  name: string
  image: any
  emoji: string
  isNegative: boolean
}

export class MoodUtil {
  static moods: MoodModel[] = [
    {
      code: "happy",
      name: "Happy",
      image: EmojiImage.emoji1,
      emoji: "😊",
      isNegative: false,
    },
    {
      code: "cool",
      name: "Feeling Cool",
      image: EmojiImage.emoji2,
      emoji: "😎",
      isNegative: false,
    },
    {
      code: "stupid",
      name: "Feeling Stupid",
      image: EmojiImage.emoji3,
      emoji: "😛",
      isNegative: false,
    },
    {
      code: "amuse",
      name: "Thinking",
      image: EmojiImage.emoji4,
      emoji: "🤔",
      isNegative: false,
    },
    {
      code: "emotional",
      name: "Wanna cry",
      image: EmojiImage.emoji5,
      emoji: "😭",
      isNegative: false,
    },
    {
      code: "angry",
      name: "Angry",
      image: EmojiImage.emoji6,
      emoji: "😡",
      isNegative: true,
    },
    {
      code: "sad",
      name: "Sad",
      image: EmojiImage.emoji7,
      emoji: "😔",
      isNegative: true,
    },
    {
      code: "scare",
      name: "Feeling Scared",
      image: EmojiImage.emoji8,
      emoji: "😣",
      isNegative: true,
    },
    {
      code: "disappointed",
      name: "Disappointed",
      image: EmojiImage.emoji9,
      emoji: "😫",
      isNegative: true,
    },
  ]

  public static getMoods(): MoodModel[] {
    return MoodUtil.moods
  }

  public static getMood(code: string): MoodModel | null {
    return MoodUtil.moods.find((a) => a.code === code) ?? null
  }
}
