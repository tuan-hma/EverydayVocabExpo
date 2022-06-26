import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Rick and Morty character model.
 */
export const SettingOptionModel = types.model("settingOption").props({
  // TODO rewrite this shit
  id: types.identifier,
  value: types.maybe(types.string),
})

export class SettingOptionIdDefine {
  public static colorTheme = "colorTheme"
}

type SettingOptionType = Instance<typeof SettingOptionModel>
export interface settingOption extends SettingOptionType {}
type SettingOptionSnapshotType = SnapshotOut<typeof SettingOptionModel>
export interface SettingOptionSnapshot extends SettingOptionSnapshotType {}
export const createSettingOptionDefaultModel = () => types.optional(SettingOptionModel, {})
