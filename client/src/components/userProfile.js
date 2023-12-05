import React from 'react';
import { useAuth } from './authContext';

function UserProfile() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <div>Please log in to view this page.</div>;
  }

  return (
    <div className="user-profile">
      <h1>User Profile</h1>
      <p>Username: {currentUser.user.username}</p>
      <p>Reputation: {currentUser.user.reputation}</p>
    </div>
  );
}

export default UserProfile;
