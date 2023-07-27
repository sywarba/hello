
import { userList } from '../User/User-ts';
import { PrismaClient } from "@prisma/client";
import * as fs from 'fs'
const prisma = new PrismaClient();

export let annonceList = (JSON.parse(fs.readFileSync('/app/prisma/seed-generated-output/data/Annonce/Annonce.json', 'utf-8')))["Annonce"]

export const addAnnonceSeedData = async() => {
    try {
        let usedUserIds: any[] = []
        
        annonceList = annonceList.map((fields: any) => {
            let relationFieldsToAdd: any = {}
            
            let userId = undefined
            if (usedUserIds.length < userList.length) {
                while (usedUserIds.includes(userId) || userId === undefined) {
                    userId = userList[Math.floor(Math.random() * (userList.length))].id
                }
                relationFieldsToAdd["userId"] = userId 
                usedUserIds.push(userId)
            }
        
            return Object.keys(relationFieldsToAdd).length == 0 ?  fields : {...fields, ...relationFieldsToAdd}
        })

        
        for (let i = 0; i < annonceList.length; i++) {
            await prisma.annonce.upsert({
                where: {
                    id: annonceList[i].id,
                },
                update: annonceList[i],
                create: annonceList[i],
            })

        }
    } catch (error: any) {
        console.log("Error pushing to: Annonce")
        console.log("Error:", error)
    }

}