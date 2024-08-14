 const { prisma } = require('./prismaDbHelper')
 
 async function getUserByUid(uid) {
    // Pseudo code:
    // 1. Use Prisma ORM to query the database
    // 2. Find a unique user based on the provided uid
    // 3. Return the user object if found, or null if not found

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
