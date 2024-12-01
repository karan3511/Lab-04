// import React, { useState, useContext, useEffect } from "react";
// import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
// import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";
// import AuthContext from "../contexts/AuthContext";

// const EventScreen = ({ route, navigation }) => {
//   const { user } = useContext(AuthContext);
//   const db = getFirestore();
//   const { event, onEventChange } = route.params || {}; 
//   const [title, setTitle] = useState(event?.title || "");
//   const [description, setDescription] = useState(event?.description || "");
//   const [isFavorite, setIsFavorite] = useState(event?.favorites?.includes(user.uid) || false);

  
//   const fetchEvents = async () => {
//     const querySnapshot = await getDocs(collection(db, "events"));
//     const allEvents = querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

   
//     const filteredEvents = allEvents.filter((event) => event.userId === user.uid);
//     return filteredEvents;
//   };

//   useEffect(() => {
//     fetchEvents(); 
//   }, [user]); 

//   const handleSave = async () => {
//     if (!title || !description) {
//       Alert.alert("Validation Error", "Please fill all fields.");
//       return;
//     }
//     try {
//       if (event) {
       
//         await updateDoc(doc(db, "events", event.id), { title, description });
//         Alert.alert("Success", "Event updated successfully!");
//       } else {
      
//         await addDoc(collection(db, "events"), {
//           title,
//           description,
//           userId: user.uid,
//           favorites: [],
//         });
//         Alert.alert("Success", "Event created successfully!");
//       }
//       onEventChange(); 
//       navigation.goBack();
//     } catch (error) {
//       Alert.alert("Error", error.message);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await deleteDoc(doc(db, "events", event.id));
//       Alert.alert("Success", "Event deleted successfully!");
//       onEventChange(); 
//       navigation.goBack();
//     } catch (error) {
//       Alert.alert("Error", error.message);
//     }
//   };

//   const handleFavorite = async () => {
//     try {
//       const eventDoc = doc(db, "events", event.id);
//       const updatedFavorites = isFavorite
//         ? event.favorites.filter((uid) => uid !== user.uid) 
//         : [...event.favorites, user.uid]; 
//       await updateDoc(eventDoc, { favorites: updatedFavorites });
//       setIsFavorite(!isFavorite);
//     } catch (error) {
//       console.error("Error updating favorites:", error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         placeholder="Event Title"
//         style={styles.input}
//         value={title}
//         onChangeText={setTitle}
//       />
//       <TextInput
//         placeholder="Event Description"
//         style={[styles.input, styles.textArea]}
//         value={description}
//         onChangeText={setDescription}
//         multiline
//       />
//       <Button title={event ? "Update Event" : "Save Event"} onPress={handleSave} />
//       {event && (
//         <>
//           <Button
//             title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
//             onPress={handleFavorite}
//             color={isFavorite ? "red" : "blue"}
//           />
//           <Button title="Delete Event" onPress={handleDelete} color="red" />
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 16,
//     backgroundColor: "#f5f5f5",
//     justifyContent: "center",
//   },
//   input: {
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 12,
//     marginVertical: 12,
//     borderRadius: 8,
//     fontSize: 16,
//     color: "#333",
//   },
//   textArea: {
//     height: 150,
//     textAlignVertical: "top", 
//   },
//   button: {
//     borderRadius: 8,
//     marginVertical: 8,
//   },
// });

// export default EventScreen;


import React, { useState, useContext, useEffect } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";
import AuthContext from "../contexts/AuthContext";

const EventScreen = ({ route, navigation }) => {
  const { user } = useContext(AuthContext);
  const db = getFirestore();

  // Ensure the user is authenticated before rendering this screen
  if (!user) {
    navigation.navigate("Login");
    return null; // Do not render anything if the user is not authenticated
  }

  const { event, onEventChange } = route.params || {};
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [isFavorite, setIsFavorite] = useState(event?.favorites?.includes(user.uid) || false);

  const fetchEvents = async () => {
    const querySnapshot = await getDocs(collection(db, "events"));
    const allEvents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const filteredEvents = allEvents.filter((event) => event.userId === user.uid);
    return filteredEvents;
  };

  useEffect(() => {
    fetchEvents();
  }, [db, user]);

  const handleSave = async () => {
    if (!title || !description) {
      Alert.alert("Validation Error", "Please fill all fields.");
      return;
    }

    try {
      if (event) {
        await updateDoc(doc(db, "events", event.id), { title, description });
        Alert.alert("Success", "Event updated successfully!");
      } else {
        await addDoc(collection(db, "events"), {
          title,
          description,
          userId: user.uid,
          favorites: [],
        });
        Alert.alert("Success", "Event created successfully!");
      }

      onEventChange();
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "events", event.id));
      Alert.alert("Success", "Event deleted successfully!");
      onEventChange();
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleFavorite = async () => {
    try {
      const eventDoc = doc(db, "events", event.id);
      const updatedFavorites = isFavorite
        ? event.favorites.filter((uid) => uid !== user.uid)
        : [...event.favorites, user.uid];
      await updateDoc(eventDoc, { favorites: updatedFavorites });
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Event Title" style={styles.input} value={title} onChangeText={setTitle} />
      <TextInput
        placeholder="Event Description"
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Button title={event ? "Update Event" : "Save Event"} onPress={handleSave} />
      {event && (
        <>
          <Button title={isFavorite ? "Remove from Favorites" : "Add to Favorites"} onPress={handleFavorite} color={isFavorite ? "red" : "blue"} />
          <Button title="Delete Event" onPress={handleDelete} color="red" />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    height: 150,
    textAlignVertical: "top",
  },
});

export default EventScreen;