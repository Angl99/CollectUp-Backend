const { prisma } = require('../helpers/prismaDbHelper')

const index = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error(error)
        res.status(500).send(error);
    }
}

const create = async (req, res) => {
    const created_at = new Date().toISOString();
    const {
        firstName,
        lastName,
        email,
        uid
    } = req.body;
    console.log(req.body)
    try {
        const newUser = await prisma.user.create({
            data: {
                created_at,
                first_name: firstName,
                last_name: lastName,
                email: email,
                uid: uid
            }
        })
        res.status(201).json(newUser)
    } catch (error) {
        console.error(error);
        if (error.code === 'P2002' && error.meta && error.meta.target.includes('email')) {
            // If the error is due to a unique constraint on the email field
            return res.status(400).send({ message: 'Email address already in use.' });
        } else {
            // Handle other potential errors
            return res.status(500).send({ message: 'An unexpected error occurred.' });
        }
    }
}

const getById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(id),
            },
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

const updateById = async (req, res) => {
    const { id } = req.params;
    let { 
        firstName,
        lastName,
        dateOfBirth,
        email,
     } = req.body; // Destructure email from update data

    try {
        // If email is being updated, check its uniqueness first
        if (email) {
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });
            console.log(existingUser);

            // If another user with the new email already exists, return an error
            if (existingUser && existingUser.id !== parseInt(id)) {
                return res.status(400).send({ message: 'Email address is already in use by another account.' });
            }
        }

        // Proceed with the update
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                first_name: firstName,
                last_name: lastName,
                email: email,
            },
        });

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An unexpected error occurred.' });
    }
};

const deleteById = async (req, res) => {
    const { id } = req.params;
    const numericId = parseInt(id, 10);

    try {
        const user = await prisma.user.findUnique({
            where: { id: numericId },
        });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Delete user and all related data
        const deletedUser = await prisma.user.delete({
            where: { id: numericId },
            include: {
                showcases: true,
                items: true,
                collections: true,
            },
        });

        return res.status(200).send({
            message: 'User and all associated data successfully deleted',
            deletedUser: deletedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An unexpected error occurred during deletion' });
    }
}

module.exports = {
    index,
    create,
    getById,
    updateById,
    deleteById
}
