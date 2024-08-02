const { prisma } = require('../helpers/prismaDbHelper');

const userController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      // Fetch all users from the database
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  },

  // Create a new user
  createUser: async (req, res) => {
    const { firstName, lastName, email, uid } = req.body;
    const created_at = new Date().toISOString();

    try {
      // Create a new user with an associated showcase
      const newUser = await prisma.user.create({
        data: {
          created_at,
          first_name: firstName,
          last_name: lastName,
          email: email,
          uid: uid,
          showcases: {
            create: {
              name: `${firstName}'s Showcase`
            }
          }
        },
        include: {
          showcases: true
        }
      });
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.code === 'P2002' && error.meta && error.meta.target.includes('email')) {
        res.status(400).json({ error: 'Email address already in use.' });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred.' });
      }
    }
  },

  // Get a user by ID
  getUserById: async (req, res) => {
    const { id } = req.params;
    try {
      // Find the user by their ID
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  },

  // Get a user by Firebase UID
  getUserByFirebaseId: async (req, res) => {
    const { uid } = req.params;
    try {
      // Find the user by their Firebase UID
      const user = await prisma.user.findUnique({
        where: { uid: uid },
      });
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  },

  // Update a user by ID
  updateUserById: async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, streetAddress1, streetAddress2, city, state, zipCode, bio, uid } = req.body;

    try {
      // Check if the new email is already in use by another user
      if (email) {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });
        if (existingUser && existingUser.id !== parseInt(id)) {
          return res.status(400).json({ error: 'Email address is already in use by another account.' });
        }
      }

      // Update the user in the database
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          streetAddress1: streetAddress1,
          streetAddress2: streetAddress2,
          city: city,
          state: state,
          zipCode: zipCode,
          bio: bio,
          uid: uid
        },
      });

      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  },

  // Delete a user by ID
  deleteUserById: async (req, res) => {
    const { id } = req.params;
    const numericId = parseInt(id, 10);

    try {
      // Check if the user exists
      const user = await prisma.user.findUnique({
        where: { id: numericId },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Start a transaction to ensure all operations are performed or none
      const result = await prisma.$transaction(async (prisma) => {
        // Delete all related items
        await prisma.item.deleteMany({
          where: { userId: numericId },
        });

        // Delete the showcase (if exists)
        await prisma.showcase.deleteMany({
          where: { userId: numericId },
        });

        // Finally, delete the user
        const deletedUser = await prisma.user.delete({
          where: { id: numericId },
        });

        return deletedUser;
      });

      res.status(200).json({
        message: 'User and all associated data successfully deleted',
        deletedUser: result
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'An unexpected error occurred during deletion' });
    }
  },
};

module.exports = userController;
