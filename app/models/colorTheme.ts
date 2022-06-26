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
  id: string
  name: string
  palette: ColorPalette
}

export class ColorThemeUtil {
  static colorThemes: ColorTheme[] = [
    {
      id: "moodyViolet",
      name: "Moody Violet",
      palette: paletteDark,
    },
    {
      id: "lightGarden",
      name: "Light Garden",
      palette: paletteGreen,
    },
  ]

  static defaultColorTheme: ColorTheme = ColorThemeUtil.colorThemes[0]

  public static getColorThemeById(id: string | undefined | null): ColorTheme {
    return (
      ColorThemeUtil.colorThemes.find((colorTheme) => colorTheme.id === id) ??
      ColorThemeUtil.defaultColorTheme
    )
  }

  // public static getMood(code: string): MoodModel | null {
  //   return MoodUtil.moods.find((a) => a.code === code) ?? null
  // }
}
