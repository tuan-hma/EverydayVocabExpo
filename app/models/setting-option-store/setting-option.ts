import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Rick and Morty character model.
 */
export const SettingOptionModel = types.model("SettingOption").props({
  id: types.identifier,
  settingValue: types.maybe(types.string),
})

export class SettingOptionIdDefine {
  public static colorTheme = "colorTheme"
  public static shouldActionAfterPost = "shouldActionAfterPost"
}

type SettingOptionType = Instance<typeof SettingOptionModel>
export interface SettingOption extends SettingOptionType {}

type SettingOptionSnapshotType = SnapshotOut<typeof SettingOptionModel>
export interface SettingOptionSnapshot extends SettingOptionSnapshotType {}
export const createSettingOptionDefaultModel = () => types.optional(SettingOptionModel, {})
