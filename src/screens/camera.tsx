import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import tw from "twrnc";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import Icon from "react-native-vector-icons/FontAwesome";

export const ImagePreviewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { imageUri } = route.params as { imageUri: string };

  const handleSave = () => {
    Alert.alert("Guardar", "Função de salvar será implementada futuramente.");
  };

  const handleDownload = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão negada",
        "Você precisa permitir acesso à galeria para salvar imagens."
      );
      return;
    }

    try {
      const fileName = imageUri.split("/").pop() || `imagem_${Date.now()}.jpg`;
      const destPath = `${FileSystem.cacheDirectory}${fileName}`;

      await FileSystem.copyAsync({
        from: imageUri,
        to: destPath,
      });

      await MediaLibrary.saveToLibraryAsync(destPath);
      Alert.alert("Sucesso", "Imagem salva na galeria!");
    } catch (error) {
      console.error("Erro ao salvar imagem:", error);
      Alert.alert("Erro", "Não foi possível salvar a imagem.");
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-slate-900`}>
      {/* Cabeçalho */}
      <View style={tw`flex-row items-center justify-between px-4 py-3 bg-slate-800`}>
        <Text style={tw`text-white text-lg font-bold`}>Pré-visualização</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Imagem */}
      <View style={tw`flex-1 items-center justify-center px-4`}>
        <Image
          source={{ uri: imageUri }}
          style={tw`w-full h-90 rounded-xl shadow-lg`}
          resizeMode="cover"
        />
      </View>

      {/* Ações */}
      <View style={tw`px-6 pb-6`}>
        <TouchableOpacity
          onPress={handleSave}
          style={tw`bg-blue-500 py-3 rounded-3xl mb-3 shadow-md`}
        >
          <Text style={tw`text-white text-center text-base font-semibold`}>
            Guardar Edição
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDownload}
          style={tw`bg-green-500 py-3 rounded-3xl mb-3 shadow-md`}
        >
          <Text style={tw`text-white text-center text-base font-semibold`}>
            Baixar para Galeria
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`py-3 rounded-lg`}
        >
          <Text style={tw`text-center text-red-400 font-medium text-base`}>
            Cancelar e Voltar
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
