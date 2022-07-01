import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { SavingModel, SavingSnapshot } from "./saving"
import { CharacterApi } from "../../services/api/character-api"
import { withEnvironment } from "../extensions/with-environment"
import AsyncStorage from "@react-native-async-storage/async-storage"

/**
 * Example store containing Rick and Morty characters
 */
export const SavingStoreModel = types
  .model("SavingStore")
  .props({
    savings: types.optional(types.array(SavingModel), []),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    addFeed: (snapshot: SavingSnapshot) => {
      // const jsonValue = JSON.stringify(self.feeds)
      // AsyncStorage.setItem("@feeds", jsonValue)
      self.savings.clear()
      self.savings.push(snapshot)
    },
  }))
  .actions((self) => ({
    getFeeds: async () => {
      const value = await AsyncStorage.getItem("@feeds")
      if (value !== null) {
        // value previously stored
        const savedData = JSON.parse(value) as FeedSnapshot[]
        self.saveFeeds(savedData)
      }
    },
  }))

type SavingStoreType = Instance<typeof SavingStoreModel>
export interface SavingStore extends SavingStoreType {}

export const createSavingStoreDefaultModel = () => types.optional(SavingStoreModel, {})
