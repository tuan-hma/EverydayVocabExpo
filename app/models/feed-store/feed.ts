import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Rick and Morty character model.
 */
export const FeedModel = types.model("Feed").props({
  // TODO rewrite this shit
  id: types.identifierNumber,
  emotion: types.maybe(types.string),
  content: types.maybe(types.string),
  image: types.maybe(types.string),
})

type FeedType = Instance<typeof FeedModel>
export interface Feed extends FeedType {}
type FeedSnapshotType = SnapshotOut<typeof FeedModel>
export interface FeedSnapshot extends FeedSnapshotType {}
export const createFeedDefaultModel = () => types.optional(FeedModel, {})
