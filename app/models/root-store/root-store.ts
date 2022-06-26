import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { CharacterStoreModel } from "../character-store/character-store"
import { FeedStoreModel } from "../feed-store/feed-store"
import { SettingOptionStoreModel } from "../setting-store/setting-option-store"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  characterStore: types.optional(CharacterStoreModel, {} as any),
  feedStore: types.optional(FeedStoreModel, {} as any),
  settingOptionStore: types.optional(SettingOptionStoreModel, {} as any),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
