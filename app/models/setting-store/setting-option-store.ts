import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { SettingOptionModel, SettingOptionSnapshot } from "./setting-option"
import { withEnvironment } from "../extensions/with-environment"

/**
 * Example store containing Rick and Morty characters
 */
export const SettingOptionStoreModel = types
  .model("SettingOptionStore")
  .props({
    settingOptions: types.optional(types.array(SettingOptionModel), []),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    getSettingOption: (optionId: string): string | undefined => {
      console.log(
        "getSettingOption",
        optionId,
        ": ",
        self.settingOptions.find((a) => a.id === optionId)?.value,
      )
      return self.settingOptions.find((a) => a.id === optionId)?.value
    },
    saveSettingOptions: (settingOptionSnapshot: SettingOptionSnapshot[]) => {
      self.settingOptions.replace(settingOptionSnapshot)
    },
    setSettingOption: (settingOptionSnapshot: SettingOptionSnapshot) => {
      self.settingOptions.replace([settingOptionSnapshot])
    },
    clearSettingOption: () => {
      self.settingOptions.clear()
    },
    deleteSettingOption: (settingOptionSnapshot: SettingOptionSnapshot) => {
      self.settingOptions.remove(settingOptionSnapshot)
    },
  }))

type SettingOptionStoreType = Instance<typeof SettingOptionStoreModel>
export interface SettingOptionStore extends SettingOptionStoreType {}

type SettingOptionStoreSnapshotType = SnapshotOut<typeof SettingOptionStoreModel>
export interface SettingOptionStoreSnapshot extends SettingOptionStoreSnapshotType {}
export const createSettingOptionStoreDefaultModel = () =>
  types.optional(SettingOptionStoreModel, {})
