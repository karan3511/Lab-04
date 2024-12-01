import React, { useEffect, useState, useContext } from "react";
import { View, FlatList, Button, StyleSheet, TouchableOpacity, Text } from "react-native";
import { getFirestore, doc, updateDoc, getDocs, collection } from "firebase/firestore";
import AuthContext from "../contexts/AuthContext";

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const { user } = useContext(AuthContext);
  const db = getFirestore();

  useEffect(() => {
    const fetchFavorites = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      const favList = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((event) => event.favorites?.includes(user.uid));
      setFavorites(favList);
    };
    fetchFavorites();
  }, [user]);

  const handleRemoveFavorite = async (eventId) => {
    try {
      const eventDoc = doc(db, "events", eventId);
      const updatedFavorites = favorites.filter((fav) => fav.id !== eventId);
      setFavorites(updatedFavorites);
      await updateDoc(eventDoc, {
        favorites: updatedFavorites.map((fav) => fav.userId !== user.uid),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.favoriteItem}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Button
              title="Remove"
              onPress={() => handleRemoveFavorite(item.id)}
              color="red"
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: "#f5f5f5", 
    },
    favoriteItem: {
      padding: 16,
      backgroundColor: "#fff", 
      marginBottom: 12, 
      borderRadius: 8,
      shadowColor: "#000", 
      shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.1, 
      shadowRadius: 8, 
      elevation: 5, 
    },
    eventTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333", 
      marginBottom: 8,
    },
    removeButton: {
      backgroundColor: "#e63946", 
      borderRadius: 6, 
      paddingVertical: 10,
      paddingHorizontal: 20, 
      alignItems: "center",
      justifyContent: "center",
    },
    removeButtonText: {
      color: "#fff", 
      fontSize: 16,
      fontWeight: "bold",
    },
  });
  
export default FavoritesScreen;
  
