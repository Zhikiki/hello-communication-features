import { StatusBar } from 'expo-status-bar';
import { Alert, Button, Image, StyleSheet, Text, View } from 'react-native';

import { useState } from 'react';

// Import image picker package
// * - iports everything which is exported in package
import * as ImagePicker from 'expo-image-picker';

// Import Media Liprary package
import * as MediaLibrary from 'expo-media-library';

// importing packages anabling Geolocation communication features
import * as Location from 'expo-location';
import MapView from 'react-native-maps';

const App = () => {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);

  /**
   * this function
   * asks permission from the user to get access to media library requestMediaLibraryPermissionsAsync() returns boolean
   * if permission granted (true) device's media library is opened
   * mediaTypes: ImagePicker.MediaTypeOptions.Images object is passed to launchImageLibraryAsync()
   * this allows to choose allowed media types (Images, Videos, All)
   * ImagePicker.launchImageLibraryAsync() returns an object (result), containing assets property
   * assets is the array referencing all of picked media files
   * result also contains the boolean property '.canceled'. This will be true if the user cancels the process and doesn’t pick a file.
   * In general function returns an object containing selected media file data
   */
  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled) setImage(result.assets[0]);
      else setImage(null);
    }
  };

  /**
   * this function
   * asks permission from the user to get access to camera requestCameraPermissionsAsync() returns boolean
   * if permission granted (true) device's camera is opened
   * ImagePicker.launchCameraAsync() returns an object (result), containing assets property
   * asset is the array referencing created media file
   * result also contains the boolean property '.canceled'. This will be true if the user cancels the process and doesn’t pick a file.
   * In general function returns an object containing created media file data
   */
  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();

    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();

      if (!result.canceled) {
        let mediaLibraryPermissions =
          await MediaLibrary.requestPermissionsAsync();
        if (mediaLibraryPermissions?.granted)
          await MediaLibrary.saveToLibraryAsync(result.assets[0].uri);
        setImage(result.assets[0]);
      } else setImage(null);
    }
  };
  /**Function make avaliable to send location
   * Location.requestForegroundPermissionsAsync() - request permission to access the device’s location
   * if permissions.granted = true we get access to read location data
   * Location.getCurrentPositionAsync() - returns an object with coordiantes of user's location
   */

  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();

    if (permissions?.granted) {
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } else {
      Alert.alert("Permissions to read location aren't granted");
    }
  };

  return (
    <View style={styles.container}>
      {image && (
        <Image
          source={{ uri: image.uri }}
          style={{ width: 150, height: 150 }}
        />
      )}
      <Button title='Pick the image from the library' onPress={pickImage} />

      <Button title='Take a photo' onPress={takePhoto} />
      {location && (
        <MapView
          style={{ width: 300, height: 300 }}
          region={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922, // determine the size of the map
            longitudeDelta: 0.0421, // determine the size of the map
          }}
        />
      )}
      <Button title='Get my location' onPress={getLocation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
