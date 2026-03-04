import User from '../models/User.js';

/**
 * POST /api/auth/sync
 * Called by the frontend immediately after Auth0 login.
 * Creates a new User document if this is their first login,
 * or updates their profile data if they already exist.
 * The JWT is already validated by checkJwt middleware before this runs.
 */
export const syncUser = async (req, res, next) => {
    try {
        // req.auth.sub is the Auth0 user ID from the validated JWT
        const auth0Id = req.auth?.payload?.sub;

        if (!auth0Id) {
            return res.status(400).json({ error: 'Invalid token: missing sub claim.' });
        }

        const { email, name, picture } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required.' });
        }

        // Upsert: create on first login, update profile on subsequent logins
        const user = await User.findOneAndUpdate(
            { auth0Id },
            {
                $set: {
                    email: email.toLowerCase(),
                    name: name || '',
                    picture: picture || '',
                },
                $setOnInsert: { auth0Id }, // only written when document is new
            },
            {
                new: true,          // return the updated/created document
                upsert: true,       // create if not found
                runValidators: true,
            }
        );

        const isNewUser = user.createdAt.getTime() === user.updatedAt.getTime();

        return res.status(isNewUser ? 201 : 200).json({
            message: isNewUser ? 'User created successfully.' : 'User profile synced.',
            user,
        });
    } catch (error) {
        next(error); // passed to global error handler in server.js
    }
};
