import React, { useEffect, useState, useContext } from "react";
import { View, FlatList, Button, StyleSheet, TouchableOpacity, Text } from "react-native";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import AuthContext from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const [events, setEvents] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false); 
  const { user } = useContext(AuthContext);
  const db = getFirestore();
  const navigation = useNavigation();

  
  const fetchEvents = async () => {
    const querySnapshot = await getDocs(collection(db, "events"));
    const allEvents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

   
    const filteredEvents = showFavorites
      ? allEvents.filter((event) => event.favorites?.includes(user.uid))
      : allEvents.filter((event) => event.userId === user.uid); 

    setEvents(filteredEvents);
  };

  useEffect(() => {
    fetchEvents();
  }, [user, showFavorites]); 
  
  const handleEventChange = () => {
    fetchEvents(); 
  };

  return (
    <View style={styles.container}>
      <Button
        title={showFavorites ? "Show All Events" : "Show Favorite Events"}
        onPress={() => setShowFavorites((prev) => !prev)} 
      />
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Event", { event: item, onEventChange: handleEventChange })}
            style={styles.eventItem}
          >
            <Text style={styles.eventTitle}>{item.title}</Text>
            {showFavorites && <Text style={styles.favoriteText}>Favorite</Text>}
          </TouchableOpacity>
        )}
      />
      <Button title="Add Event" onPress={() => navigation.navigate("Event", { onEventChange: handleEventChange })} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#f8f8f8",
    },
    eventItem: {
      backgroundColor: "#fff",
      padding: 20,
      marginBottom: 16,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 6,
    },
    eventTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#333",
    },
    favoriteText: {
      color: "red",
      fontSize: 14,
      marginTop: 5,
    },
    favoriteIcon: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 5,
    },
    toggleButton: {
      marginBottom: 20,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#ff6347",
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: "#ff6347",
      color: "#fff",
    },
    addButton: {
      backgroundColor: "#2d87f0",
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 20,
      marginTop: 20,
    },
  });
  
export default HomeScreen;

