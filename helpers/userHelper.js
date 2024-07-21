 const { prisma } = require('./prismaDbHelper')
 
 async function getUserByUid(uid) {

    const user = await prisma.user.findUnique({
        where: {
            uid: uid,
        },
    });

    return user;
}

module.exports = {
    getUserByUid,
}