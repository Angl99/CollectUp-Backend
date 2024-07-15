const { PrismaClient } = require('@prisma/client');
const { getUserByUid } = require('../helpers/userHelper');
const prisma = new PrismaClient();

