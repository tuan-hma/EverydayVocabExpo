import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { FeedModel, FeedSnapshot } from "./feed"
import { CharacterApi } from "../../services/api/character-api"
import { withEnvironment } from "../extensions/with-environment"
import AsyncStorage from "@react-native-async-storage/async-storage"

/**
 * Example store containing Rick and Morty characters
 */
export const FeedStoreModel = types
  .model("FeedStore")
  .props({
    feeds: types.optional(types.array(FeedModel), []),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    saveFeeds: (feedSnapshots: FeedSnapshot[]) => {
      self.feeds.replace(feedSnapshots)
    },
    addFeed: (feedSnapshot: FeedSnapshot) => {
      self.feeds.push(feedSnapshot)
    },
  }))
  .actions((self) => ({
    getFeeds: async () => {
      const value = await AsyncStorage.getItem("@storage_Key")
      if (value !== null) {
        // value previously stored
      }

      if (result.kind === "ok") {
        self.saveFeeds(result.characters)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    },
  }))

type FeedStoreType = Instance<typeof FeedStoreModel>
export interface FeedStore extends FeedStoreType {}

type FeedStoreSnapshotType = SnapshotOut<typeof FeedStoreModel>
export interface FeedStoreSnapshot extends FeedStoreSnapshotType {}
export const createFeedStoreDefaultModel = () => types.optional(FeedStoreModel, {})
