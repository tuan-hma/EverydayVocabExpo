import { SnapshotOut, types } from "mobx-state-tree"

/**
 * Rick and Morty character model.
 */
export const SavingModel = types.model("Saving").props({
  // TODO rewrite this shit
  id: types.identifier,
  name: types.string,
})

type SavingSnapshotType = SnapshotOut<typeof SavingModel>
export interface SavingSnapshot extends SavingSnapshotType {}
export const createSavingDefaultModel = () => types.optional(SavingModel, {})
