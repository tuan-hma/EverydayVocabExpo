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
      const jsonValue = JSON.stringify(self.feeds)
      AsyncStorage.setItem("@feeds", jsonValue)
    },
    addFeed: (feedSnapshot: FeedSnapshot) => {
      // const jsonValue = JSON.stringify(self.feeds)
      // AsyncStorage.setItem("@feeds", jsonValue)
      self.feeds.push(feedSnapshot)
    },
    clearFeed: () => {
      self.feeds.clear()
    },
    deleteFeed: (feedSnapshot: FeedSnapshot) => {
      self.feeds.remove(feedSnapshot)
      const jsonValue = JSON.stringify(self.feeds)
      AsyncStorage.setItem("@feeds", jsonValue)
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

type FeedStoreType = Instance<typeof FeedStoreModel>
export interface FeedStore extends FeedStoreType {}

type FeedStoreSnapshotType = SnapshotOut<typeof FeedStoreModel>
export interface FeedStoreSnapshot extends FeedStoreSnapshotType {}
export const createFeedStoreDefaultModel = () => types.optional(FeedStoreModel, {})
