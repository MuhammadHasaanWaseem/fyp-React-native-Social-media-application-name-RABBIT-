import React, { useState, ReactNode } from 'react';

// Define the user type (optional, but recommended)
type User = {
  name?: string;
  email?: string;
  // Add any other fields your user object might have
};

// Define the context with a default value
export const AuthContext = React.createContext<{
  user: User;
  setuser: React.Dispatch<React.SetStateAction<User>>;
}>({
  user: {}, // Default empty object for user
  setuser: () => {}, // Default no-op function for setuser
});

// Custom hook to use the AuthContext
export const useAuth = () => React.useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode; // Correctly typed children prop
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setuser] = useState<User>({}); // State with typed user

  return (
    <AuthContext.Provider value={{ user, setuser }}>
      {children}
    </AuthContext.Provider>
  );
};
