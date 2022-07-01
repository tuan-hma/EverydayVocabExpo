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
  // .extend(withEnvironment)
  .actions((self) => ({
    setSettingOption: (settingOptionSnapshot: SettingOptionSnapshot) => {
      console.log("this called")
      // self.settingOptions.replace([settingOptionSnapshot])
      // self.settingOptions.clear()
      const savedValue = self.settingOptions.find((a) => a.id === settingOptionSnapshot.id)
      if (savedValue) {
        savedValue.settingValue = settingOptionSnapshot.settingValue
      } else {
        self.settingOptions.push(settingOptionSnapshot)
      }
    },
  }))
  .views((self) => ({
    getSettingOption: (optionId: string): string | undefined => {
      return self.settingOptions.find((a) => a.id === optionId)?.settingValue
    },
  }))

type SettingOptionStoreType = Instance<typeof SettingOptionStoreModel>
export interface SettingOptionStore extends SettingOptionStoreType {}

type SettingOptionStoreSnapshotType = SnapshotOut<typeof SettingOptionStoreModel>
export interface SettingOptionStoreSnapshot extends SettingOptionStoreSnapshotType {}
export const createSettingOptionStoreDefaultModel = () =>
  types.optional(SettingOptionStoreModel, {})
