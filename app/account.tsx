import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useMemo, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

import { AuthInput } from '@/components/auth/auth-input';
import { AuthPrimaryButton } from '@/components/auth/auth-primary-button';
import { AuthScreenLayout } from '@/components/auth/auth-screen-layout';
import { UserAvatar } from '@/components/ui/user-avatar';
import { useUser } from '@/contexts/user-context';

export default function AccountScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useUser();

  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [email, setEmail] = useState(profile.email);
  const [password, setPassword] = useState(profile.password);
  const [avatarUri, setAvatarUri] = useState(profile.avatarUri);
  const [isImageActionLoading, setImageActionLoading] = useState(false);

  const isFormValid = useMemo(
    () => Boolean(firstName.trim()) && Boolean(lastName.trim()) && Boolean(email.trim()) && Boolean(password),
    [email, firstName, lastName, password]
  );

  const handleSave = () => {
    if (!isFormValid) {
      Alert.alert('Champs manquants', 'Merci de remplir tous les champs obligatoires.');
      return;
    }

    updateProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password,
      avatarUri: avatarUri.trim(),
    });

    Alert.alert('Profil mis a jour', 'Tes informations ont ete enregistrees.');
    router.back();
  };

  const handlePickFromGallery = async () => {
    if (isImageActionLoading) {
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission requise', 'Active la galerie pour choisir une photo de profil.');
      return;
    }

    try {
      setImageActionLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setAvatarUri(result.assets[0].uri);
      }
    } finally {
      setImageActionLoading(false);
    }
  };

  const handleTakePhoto = async () => {
    if (isImageActionLoading) {
      return;
    }

    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission requise', 'Active la camera pour prendre une photo de profil.');
      return;
    }

    try {
      setImageActionLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setAvatarUri(result.assets[0].uri);
      }
    } finally {
      setImageActionLoading(false);
    }
  };

  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <AuthScreenLayout>
      <View className="flex-1 py-6">
        <View className="items-center">
          <Text className="text-3xl font-bold text-slate-900">Mon compte</Text>
          <View className="mt-4">
            <UserAvatar imageUri={avatarUri.trim() || undefined} name={fullName} size={88} />
          </View>
          <View className="mt-4 w-full gap-2">
            <AuthPrimaryButton
              disabled={isImageActionLoading}
              label="Choisir dans la galerie"
              onPress={handlePickFromGallery}
              variant="secondary"
            />
            <AuthPrimaryButton
              disabled={isImageActionLoading}
              label="Prendre une photo"
              onPress={handleTakePhoto}
              variant="secondary"
            />
          </View>
        </View>

        <View className="mt-8 gap-4">
          <AuthInput
            autoCapitalize="words"
            onChangeText={setFirstName}
            placeholder="Prenom"
            value={firstName}
          />
          <AuthInput
            autoCapitalize="words"
            onChangeText={setLastName}
            placeholder="Nom"
            value={lastName}
          />
          <AuthInput
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="Adresse email"
            value={email}
          />
          <AuthInput
            onChangeText={setPassword}
            placeholder="Mot de passe"
            secureTextEntry
            value={password}
          />
        </View>

        <View className="mt-auto gap-3">
          <AuthPrimaryButton disabled={!isFormValid} label="Enregistrer" onPress={handleSave} />
          <Pressable className="items-center py-2" onPress={() => router.back()}>
            <Text className="text-base font-medium text-slate-700">Annuler</Text>
          </Pressable>
        </View>
      </View>
    </AuthScreenLayout>
  );
}
