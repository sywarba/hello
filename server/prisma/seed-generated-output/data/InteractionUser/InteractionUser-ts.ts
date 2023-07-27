
import { userList } from '../User/User-ts';
import { PrismaClient } from "@prisma/client";
import * as fs from 'fs'
const prisma = new PrismaClient();

export let interactionUserList = (JSON.parse(fs.readFileSync('/app/prisma/seed-generated-output/data/InteractionUser/InteractionUser.json', 'utf-8')))["InteractionUser"]

export const addInteractionUserSeedData = async() => {
    try {
        let usedUserId_1s: any[] = []
	let usedUserId_2s: any[] = []
        
        interactionUserList = interactionUserList.map((fields: any) => {
            let relationFieldsToAdd: any = {}
            
            let userId_1 = undefined
            if (usedUserId_1s.length < userList.length) {
                while (usedUserId_1s.includes(userId_1) || userId_1 === undefined) {
                    userId_1 = userList[Math.floor(Math.random() * (userList.length))].id
                }
                relationFieldsToAdd["userId_1"] = userId_1 
                usedUserId_1s.push(userId_1)
            }

            let userId_2 = undefined
            if (usedUserId_2s.length < userList.length) {
                while (usedUserId_2s.includes(userId_2) || userId_2 === undefined) {
                    userId_2 = userList[Math.floor(Math.random() * (userList.length))].id
                }
                relationFieldsToAdd["userId_2"] = userId_2 
                usedUserId_2s.push(userId_2)
            }
        
            return Object.keys(relationFieldsToAdd).length == 0 ?  fields : {...fields, ...relationFieldsToAdd}
        })

        
        for (let i = 0; i < interactionUserList.length; i++) {
            await prisma.interactionUser.upsert({
                where: {
                    id: interactionUserList[i].id,
                },
                update: interactionUserList[i],
                create: interactionUserList[i],
            })

        }
    } catch (error: any) {
        console.log("Error pushing to: InteractionUser")
        console.log("Error:", error)
    }

}