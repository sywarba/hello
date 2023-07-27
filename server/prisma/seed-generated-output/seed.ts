
import { addAppConfigSeedData } from "./data/AppConfig/AppConfig-ts"
import { addUserSeedData } from "./data/User/User-ts"
import { addAnnonceSeedData } from "./data/Annonce/Annonce-ts"
import { addInteractionSeedData } from "./data/Interaction/Interaction-ts"
import { addInteractionUserSeedData } from "./data/InteractionUser/InteractionUser-ts"

export const pushSeed = async() => {
    await addAppConfigSeedData()
	await addUserSeedData()
	await addAnnonceSeedData()
	await addInteractionSeedData()
	await addInteractionUserSeedData()

}
pushSeed()
        