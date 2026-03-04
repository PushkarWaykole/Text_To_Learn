import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <div className="text-gray-600">Loading...</div>;
    }

    return (
        isAuthenticated && (
            <div className="flex items-center space-x-4">
                <img className="w-10 h-10 rounded-full" src={user.picture} alt={user.name} />
                <div>
                    <h2 className="text-sm font-semibold text-gray-900">{user.name}</h2>
                    <p className="text-xs text-gray-500">{user.email}</p>
                </div>
            </div>
        )
    );
};

export default Profile;
