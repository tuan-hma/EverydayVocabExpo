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
      code: "happy",
      name: "Happy",
      image: EmojiImage.emoji1,
      emoji: "☺️",
    },
    {
      code: "cool",
      name: "Feeling Cool",
      image: EmojiImage.emoji2,
      emoji: "😔",
    },
    {
      code: "stupid",
      name: "Feeling Stupid",
      image: EmojiImage.emoji3,
      emoji: "😣",
    },
    {
      code: "amuse",
      name: "Thinking",
      image: EmojiImage.emoji4,
      emoji: "😩",
    },
    {
      code: "emotional",
      name: "Feeling Touched",
      image: EmojiImage.emoji5,
      emoji: "😳",
    },
    {
      code: "angry",
      name: "Angry",
      image: EmojiImage.emoji6,
      emoji: "🥺",
    },
    {
      code: "sad",
      name: "Sad",
      image: EmojiImage.emoji7,
      emoji: "😩",
    },
    {
      code: "scare",
      name: "Feeling Scared",
      image: EmojiImage.emoji8,
      emoji: "🥺",
    },
    {
      code: "disappointed",
      name: "Disappointed",
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
