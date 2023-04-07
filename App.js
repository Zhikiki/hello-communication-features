import { StatusBar } from 'expo-status-bar';
import { Button, Image, StyleSheet, Text, View } from 'react-native';

import { useState } from 'react';

// Import image picker package
// * - iports everything which is exported in package
import * as ImagePicker from 'expo-image-picker';

const App = () => {
  const [image, setImage] = useState(null);

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

      if (!result.canceled) setImage(result.assets[0]);
      else setImage(null);
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
