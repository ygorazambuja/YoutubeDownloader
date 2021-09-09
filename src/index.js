import Clipboard from '@react-native-clipboard/clipboard';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  PermissionsAndroid,
  Text,
  TextInput,
  View,
} from 'react-native';

import ytdl from 'react-native-ytdl';
import { DownloadDirectoryPath, downloadFile } from 'react-native-fs';
import { requestStoragePermission } from './utils/permissions';

const YoutubeDownloader = () => {
  const [videoLink, setVideoLink] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState('');
  const [videoInfo, setVideoInfo] = React.useState({});

  const getLinkFromTheClipboard = async () => {
    const text = await Clipboard.getString();
    setVideoLink(text);
  };

  const getDownloadUrl = async () => {
    try {
      setLoading(true);
      const info = await ytdl.getInfo(videoLink);
      setVideoInfo(info.videoDetails);
      const download = await ytdl(videoLink);
      setDownloadUrl(download[0].url);
      await downloadVideo();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTimestamp = () => new Date().getTime();

  const downloadVideo = async () => {
    try {
      const path = `${DownloadDirectoryPath}/${getCurrentTimestamp()}.mp4`;

      setLoading(true);
      await downloadFile({
        toFile: path,
        fromUrl: downloadUrl,
      })
        .promise.then(() => {
          Alert.alert('Success', 'Video downloaded successfully');
        })
        .catch(error => {
          Alert.alert('Error', error.message);
        });
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestStoragePermission();
  }, []);

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <TextInput
        placeholder={'Video Link'}
        onChangeText={setVideoLink}
        value={videoLink}
      />
      <Text style={{ fontWeight: 'bold', fontSize: 20, paddingVertical: 30 }}>
        {videoInfo.title}
      </Text>
      <TouchableOpacity
        onPress={getLinkFromTheClipboard}
        style={{
          paddingVertical: 12,
          backgroundColor: 'blue',
          paddingHorizontal: 30,
          marginVertical: 20,
        }}>
        <Text>Colocar link copiado</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={getDownloadUrl}
        style={{
          paddingVertical: 12,
          backgroundColor: 'blue',
          paddingHorizontal: 30,
          marginVertical: 20,
        }}>
        <Text>Baixar</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator />}
    </View>
  );
};

export default YoutubeDownloader;
