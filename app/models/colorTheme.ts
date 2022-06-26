import { paletteDark, paletteGreen } from "../theme/palette"

export interface ColorPalette {
  background: string
  backgroundShade: string
  text: string
  mildText: string
  milderText: string
  accent: string
  accentShade: string
  backgroundSelected: string
  backgroundSelectedMild: string
  backgroundHightlight: string
  backgroundHightlightShade: string
  colorful1: string
  colorful2: string
}

export interface ColorTheme {
  name: string
  palette: ColorPalette
}

export class ColorThemeUtil {
  static colorThemes: ColorTheme[] = [
    {
      name: "Moody Violet",
      palette: paletteDark,
    },
    {
      name: "Light Garden",
      palette: paletteGreen,
    },
  ]

  public static getMoods(): ColorTheme[] {
    return ColorThemeUtil.colorThemes
  }

  // public static getMood(code: string): MoodModel | null {
  //   return MoodUtil.moods.find((a) => a.code === code) ?? null
  // }
}
