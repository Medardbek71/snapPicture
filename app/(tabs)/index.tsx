import { View ,StyleSheet ,Platform} from "react-native"
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import {captureRef} from 'react-native-view-shot'
import { useState , useRef } from "react";
import {type ImageSource } from "expo-image";
import ImageViewer from "@/components/ImageViewer";
import Button from '@/components/Button'
import IconButton from "@/components/iconButton";
import CircleButton from "@/components/CircleButton";
import EmojiPicker from "@/components/EmojiPicker";
import EmojiList from "@/components/EmojiList";
import EmojiSticker from "@/components/EmojiSticker";
import domtoimage from 'dom-to-image';
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'

const placeholderImage = require('@/assets/images/background-image.png')

export default function Index() {
  const [ selectedImage, setSelectedImage ] = useState<string | undefined>(undefined)
  const [showAppOptions, setShowAppOptions ] = useState<boolean>(false)
  const [isModalVisible, setModalVisible ] = useState<boolean>(false)
  const [pickedEmoji , setPickedEmoji] = useState<ImageSource|undefined>(undefined)
  const [status , requestPermission] = MediaLibrary.usePermissions()
  
  const imagePickerAsync = async()=>{
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1
    })
      if(!result.canceled){
        setSelectedImage(result.assets[0].uri)
        setShowAppOptions(true)
      }
      else{
        alert('vous avez choisi aucune image')
      }
    }
    const onReset = () => {
      setShowAppOptions(false);
  }
  const onAddSticker = ()=> {
    setModalVisible(true)
  }
  
  const onModalClose = () =>{
    setModalVisible(false)
  }
  
  const imageRef = useRef<View>(null)
  status === null && requestPermission() 

  const onSaveImageAsync = async ()=>{
    if( Platform.OS !== 'web'){
      try{
        const localUri =  await captureRef(imageRef , {
            height: 440,
            quality: 1
          })
          await MediaLibrary.saveToLibraryAsync(localUri)
          localUri && alert('Image enregistré la galerie') 
        }
      catch(e){
        console.log(e)
      }
      
    }
    else
    {
      try {
        const dataUrl = await domtoimage.toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        });

        let link = document.createElement('a');
        link.download = 'sticker-smash.jpg';
        link.href = dataUrl;
        link.click();
      } catch (e) {
        console.log(e);
      }
      }
  }


  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
          <ImageViewer 
            imgSource={placeholderImage} 
            selectedImage={selectedImage}
            /> 
          { pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji}/>}
        </View>
      </View>
      {
        showAppOptions == false ?
        (
          <View style={styles.footerContainer}>
            <Button theme="primary" label={'Choisir une image'} onPress={imagePickerAsync} />
            <Button label="Utiliser cette photo" onPress={()=>setShowAppOptions}/>
          </View>
        )
        :
        <View style={styles.optionContainer}>
          <View style={styles.optionRow}>
            <IconButton label='Refresh'  icon="refresh" onPress={onReset} />
            <CircleButton onPress={onAddSticker}/>
            <IconButton label='Save' icon="save-alt" onPress={onSaveImageAsync}/>
          </View>  
        </View>
      }
          <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
            <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose}/>
          </EmojiPicker>
    </GestureHandlerRootView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#25292e'
  },
  text: {
    color: '#fff'
  },
  imageContainer: {
    flex: 1
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center'
  },
  optionContainer: {
    position: 'absolute',
    bottom: 80
  },
  optionRow: {
    alignItems: 'center',
    flexDirection: 'row'
  }
})
