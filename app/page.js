'use client';

import NewRun from "./New-Run/new-run";
import { useUserAuth } from "./_utils/auth-context";

export default function Page() {
  const { user, gitHubSignIn, firebaseSignOut } = useUserAuth();

  const handleSignIn = async () => {
    try {
      await gitHubSignIn();
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <main>
      {user ? (
        <>
          <h1>Welcome, {user.displayName} ({user.email})</h1>
          <button onClick={handleSignOut} className="bg-red-500 text-white p-2 rounded">
            Sign Out
          </button>
          <NewRun />
          <p><a href = "./New-Run">New Run here</a></p>
        </>
      ) : (
        <>
          <h1>Welcome to Crunicle</h1>
          <button onClick={handleSignIn} className="bg-blue-500 text-white p-2 rounded">
            Sign In with GitHub
          </button>
        </>
      )}
    </main>
  );
}