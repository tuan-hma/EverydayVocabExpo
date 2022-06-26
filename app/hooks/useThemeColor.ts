import { useEffect, useState } from "react"
import { ColorPalette, ColorTheme, ColorThemeUtil } from "../models/colorTheme"
import { paletteDark } from "../theme/palette"

export interface ColorThemeHookProps {
  colorTheme: ColorTheme
  setColorTheme: (ColorTheme) => void
}
export function useColorTheme(): ColorThemeHookProps {
  const [currentColorTheme, setCurrentColorTheme] = useState<ColorTheme>(
    ColorThemeUtil.colorThemes[0],
  )

  return {
    colorTheme: currentColorTheme,
    setColorTheme: (colorTheme: ColorTheme) => {
      setCurrentColorTheme(colorTheme)
    },
  }
}
