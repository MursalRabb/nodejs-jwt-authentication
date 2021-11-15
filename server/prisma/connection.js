const {PrismaClient} = require('@prisma/client')


const prisma = new PrismaClient()


async function connect ( ) {
    try {
        console.log('establishiing connection')
        await prisma.$connect()
        console.log('connection established')
    } catch (error) {
        console.log('error connecting with the database')
    }
}



module.exports = {prisma, connect}