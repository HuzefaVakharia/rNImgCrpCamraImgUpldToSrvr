//import liraries
import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  Text,
  Alert,
  StyleSheet,
  FlatList,
  Button,
  PermissionsAndroid,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
//For latest React Native cli video see this: https://www.youtube.com/watch?v=irRbBXotgLA
// React Native Image Crop Picker npm command from this site: https://github.com/ivpusic/react-native-image-crop-picker
// create a component
//For granting permission check this: https://stackoverflow.com/questions/45711011/error-permissions-not-granted-react-native-image-picker

//Currently watching this video: https://www.youtube.com/watch?v=brE91Obyn78&t=501s

//Ref of video which helped in diplaying the image after selecting it: https://www.youtube.com/watch?v=wzNcB5iCXE4&t=168s

//Ref of Video to select Multiple images : https://www.youtube.com/watch?v=8gCMXXH9Vd4
const App = () => {
  const [filePath, setFilePath] = useState({});
  const [images, setImages] = useState([]);
  let imageName = '';
  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    try {
      console.log('asking for permission');
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      if (
        granted['android.permission.CAMERA'] &&
        granted['android.permission.WRITE_EXTERNAL_STORAGE']
      ) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (error) {
      console.log('permission error', error);
    }
  };

  const uploadORActuallyOpenGallery = () => {
    let imageList = [];
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      includeExif: true,
      forceJpg: true,
      compressImageQuality: 0.8,
      maxFiles: 10,
      mediaType: 'photo',
      //width: 300,
      //height: 400,
      cropping: true,
      //includeBase64: true,
    })
      .then(response => {
        console.log('Response:', JSON.stringify(response));
        /* using above console.log we are displaying all the response that we got after selecting multiple images from gallery
        Then in next step we will iterate each image selected using map() function and for each image we will create an array of name
        imageList and in that array we will put single file name, its path and its data, and after filling this array with single image
        information like filename,path and data we will use setImages() method of useState which will pass this single image
        array information inside images variable, and this images variable will be used in FlatList data to show us preview of
        that single image that we have selected. The very important information which we have to pass inside imageList array is
        path of image which we are passing using synatx path: image.path, and this path is the data which will be used to display
        image in our FlatList. */
        response.map(image => {
          imageList.push({
            //filename: image.filename,
            path: image.path,
            //data: image.data,
            type: image.mime,
          });
          //imageName = image.path;
          //console.log('filename -> ', imageName.slice(30, 50));
          console.log('FileName ->', image.path);
          console.log('path -> ', image.path);
          console.log('Type -> ', image.mime);
        });
        //By below syntax code of setImages(imageList) we will pass all the images data that we select from gallery in our images variable which is going to use in our Flatlist data
        setImages(imageList);

        //console.log(response.path);
        //setFilePath(response.path);
      })
      .catch(error =>
        console.log(
          'Error while executing uploadORActuallyOpenGallery is:',
          error,
        ),
      );
  };

  const uploadImageAndStringForAddNewOrder = async xyz => {
    Alert.alert('uploadImageAndStringForAddNewOrder executing');
    //setIsLoading(true);
    //gotoOrderScreen();
    //alert('Order ID is:'+orderIDToEdit);

    // Check if any file is selected or not.
    // alert('Single file is not null');

    const formdata = new FormData();
    //imagesRef upload karsu
    //for (let i = 0; i < imagesRef.length; i++) {
    for (let i = 0; i < images.length; i++) {
      alert(
        'For Image number:' +
          i +
          '\n' +
          'File uri is:' +
          images[i].path +
          '\n' +
          'File Name is:' +
          images[i].path +
          '\n' +
          'File mimeType is:' +
          images[i].type,
      );
      formdata.append(
        'image_file[]',

        {
          uri: images[i].path,
          type: images[i].type,
          name: images[i].path,
        },
      );
    }

    formdata.append('customer_id', '5');
    formdata.append('supplier_id', '2');
    formdata.append('category_id', '2');
    formdata.append('order_date', '2023-09-12');
    formdata.append('order_for', 'Client');
    formdata.append('order_type', 'Gold');
    formdata.append('item', 'MultiImageUploadTest2');
    formdata.append('carret_id', '2');
    formdata.append('color_id', '1');
    formdata.append('qty', '11');
    formdata.append('size', 'xlxlxlx');
    formdata.append('narration', 'testing Image Upload from RNCLI');
    formdata.append('delivery_date', '2023-09-20');

    formdata.append('hallmark', 'isi');
    formdata.append('priority', 'normal');

    Alert.alert('Form Data created successfully.');
    try {
      let res = await fetch(
        'https://rajeshwersoftsolution.com/jwelcart/api/insert_order',
        {
          method: 'post',
          body: formdata,
          headers: {
            Authorization:
              'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZjQxZmFjNWU2ZTc0YWU1ZWQ4NWJkOWY0MWEzNzQ1YmY0MzRkMmIzOTc5NGFhNTRjNWFkOTIxMTM5ZTE5NjQzYjY0NjI1Yzk4MTQxMmEyZDkiLCJpYXQiOjE2OTcxMTE2MjMsIm5iZiI6MTY5NzExMTYyMywiZXhwIjoxNzI4NzM0MDIzLCJzdWIiOiI0OSIsInNjb3BlcyI6W119.Jbeuqj3Hz7KaGySO7D3pTupJs_tJ8NAcVx33dyeYFgo1chcqnG9dsuaJEF9pMB-g53p2bXkIR187vnupPy5ICBe1fHI1Rg8JG3FO7wrFo0ZyRtPqlx_ofOz017mCsPOsul9GAXLvqFh-6ijZwQ_Aw2yRk8EfbZ0b2D4WRa3TAd0TzLdK6QzAg7A3SJSM79NpXy2kTTs-xy-KEbGvXUQ-NTB-f81PDs0RvfXK_itmwR_j4H_STJ8YG7357wSUhdeB4o5-TMsFPFUBxE3Ehdneo6mqCKXcpPNHf86ZDFl5Sw-_NPeGyMrAN_ZUq90Vyf6mI5zxhokohd7SARmY7h2jU6LjoUZar-Hp4cWdQvsVXGH0JlewIGdGRoBMEly3Q-aJNr3DYhXbT1007n74-GTxElTfjXOUTcYeE6XGwLYzPUkLiEQzOU0epIQ6J_Xch9z6Rg4t58tJqb3LfDZXVLmTLkMr2nyJAeaa6Y8IJiEn5l-WNLP7TYEKp-XBlgMhFF5KSOntyYgg5ZG09weJ2YgPv0Q2Oi78JrAaDjLDq4e9mQxRA9mWmKaXHW3fUk9Ufc0CsVW76rHZcejD_BthARLErgyhAF68MaaPCdo_xzLqxCbwhr893fcjDmo5UzdaCpWvH5oQDe9A1CWjS1GMdTkOi4gghC4jGcjr37ydLT-lTsw',
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      let result = await res.json();
      console.log('result', result);
      Alert.alert('Info after Uploading Image:' + result.message);
      //setIsLoading(false);
      //gotoOrderScreen();
    } catch (error) {
      console.log('error upload', error);
    }

    //gotoOrderScreen();
  };
  return (
    <View style={styles.container}>
      <Text>App</Text>
      {/* <Image source={{uri: filePath}} style={{height: 200, width: 200}} /> */}

      <View style={{marginBottom: 10}}>
        <Button title="Open Gallery" onPress={uploadORActuallyOpenGallery} />
      </View>
      <View style={{marginTop: 0}}>
        <Button
          title="UPLOAD IMAGES"
          onPress={() => uploadImageAndStringForAddNewOrder('XYZ')}
        />
      </View>
      <FlatList
        data={images}
        renderItem={({item}) => (
          <Image source={{uri: item.path}} style={{height: 200, width: 200}} />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default App;
