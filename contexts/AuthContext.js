// import React, { createContext, useState, useEffect } from "react";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { app } from "../firebaseConfig";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const auth = getAuth(app);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, setUser);
//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, auth }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;


import React, { createContext, useState, useEffect } from "react";
import { View, Text } from "react-native"; // Correct import for View and Text
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebaseConfig"; // Ensure this is correct


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for checking if user is authenticated
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Once the user state is set, stop loading
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    // Optionally render a loading screen while waiting for the auth state to be resolved
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, auth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
