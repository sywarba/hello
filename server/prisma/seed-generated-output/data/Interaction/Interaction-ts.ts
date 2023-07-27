
import { userList } from '../User/User-ts';
import { annonceList } from '../Annonce/Annonce-ts';
import { PrismaClient } from "@prisma/client";
import * as fs from 'fs'
const prisma = new PrismaClient();

export let interactionList = (JSON.parse(fs.readFileSync('/app/prisma/seed-generated-output/data/Interaction/Interaction.json', 'utf-8')))["Interaction"]

export const addInteractionSeedData = async() => {
    try {
        let usedUserIdIs: any[] = []
	let usedAnnonceIds: any[] = []
        
        interactionList = interactionList.map((fields: any) => {
            let relationFieldsToAdd: any = {}
            
            let userIdI = undefined
            if (usedUserIdIs.length < userList.length) {
                while (usedUserIdIs.includes(userIdI) || userIdI === undefined) {
                    userIdI = userList[Math.floor(Math.random() * (userList.length))].id
                }
                relationFieldsToAdd["userIdI"] = userIdI 
                usedUserIdIs.push(userIdI)
            }

            let annonceId = undefined
            if (usedAnnonceIds.length < annonceList.length) {
                while (usedAnnonceIds.includes(annonceId) || annonceId === undefined) {
                    annonceId = annonceList[Math.floor(Math.random() * (annonceList.length))].id
                }
                relationFieldsToAdd["annonceId"] = annonceId 
                usedAnnonceIds.push(annonceId)
            }
        
            return Object.keys(relationFieldsToAdd).length == 0 ?  fields : {...fields, ...relationFieldsToAdd}
        })

        
        for (let i = 0; i < interactionList.length; i++) {
            await prisma.interaction.upsert({
                where: {
                    id: interactionList[i].id,
                },
                update: interactionList[i],
                create: interactionList[i],
            })

        }
    } catch (error: any) {
        console.log("Error pushing to: Interaction")
        console.log("Error:", error)
    }

}