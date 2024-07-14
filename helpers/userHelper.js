 async function getUserByUid(uid) {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

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