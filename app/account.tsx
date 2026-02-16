import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { AuthInput } from '@/components/auth/auth-input';
import { AuthPrimaryButton } from '@/components/auth/auth-primary-button';
import { AuthScreenLayout } from '@/components/auth/auth-screen-layout';
import { DashboardSidebar } from '@/components/home/dashboard-sidebar';
import { AppCard } from '@/components/ui/app-card';
import { UserAvatar } from '@/components/ui/user-avatar';
import { useUser } from '@/contexts/user-context';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Feedback = {
  kind: 'success' | 'error' | 'info';
  message: string;
};

function FieldLabel({ label }: { label: string }) {
  return <Text className="mb-2 text-sm font-semibold text-slate-700">{label}</Text>;
}

function FieldHelp({ text, error = false }: { text: string; error?: boolean }) {
  return <Text className={`mt-1 text-xs ${error ? 'text-red-600' : 'text-slate-500'}`}>{text}</Text>;
}

export default function AccountScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useUser();
  const initialProfile = useRef(profile).current;

  const [firstName, setFirstName] = useState(initialProfile.firstName);
  const [lastName, setLastName] = useState(initialProfile.lastName);
  const [email, setEmail] = useState(initialProfile.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarUri, setAvatarUri] = useState(initialProfile.avatarUri);
  const [isImageActionLoading, setImageActionLoading] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const trimmedFirstName = firstName.trim();
  const trimmedLastName = lastName.trim();
  const trimmedEmail = email.trim();
  const trimmedAvatarUri = avatarUri.trim();
  const hasPasswordChanged = password.length > 0;
  const fullName = `${trimmedFirstName} ${trimmedLastName}`.trim();

  const fieldErrors = useMemo(() => {
    const errors: string[] = [];
    if (!trimmedFirstName) {
      errors.push('Le prenom est obligatoire.');
    } else if (trimmedFirstName.length < 2) {
      errors.push('Le prenom doit contenir au moins 2 caracteres.');
    }
    if (!trimmedLastName) {
      errors.push('Le nom est obligatoire.');
    } else if (trimmedLastName.length < 2) {
      errors.push('Le nom doit contenir au moins 2 caracteres.');
    }
    if (!trimmedEmail) {
      errors.push("L'adresse email est obligatoire.");
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      errors.push("Le format de l'email est invalide.");
    }
    if (hasPasswordChanged && password.length < 6) {
      errors.push('Le nouveau mot de passe doit contenir au moins 6 caracteres.');
    }
    if (confirmPassword.length > 0 && !hasPasswordChanged) {
      errors.push('Saisis un nouveau mot de passe pour confirmer.');
    }
    if (hasPasswordChanged && confirmPassword !== password) {
      errors.push('La confirmation du mot de passe ne correspond pas.');
    }
    return errors;
  }, [confirmPassword, hasPasswordChanged, password, trimmedEmail, trimmedFirstName, trimmedLastName]);

  const changedFields = useMemo(() => {
    const changes: string[] = [];
    if (trimmedFirstName !== initialProfile.firstName) {
      changes.push('Prenom');
    }
    if (trimmedLastName !== initialProfile.lastName) {
      changes.push('Nom');
    }
    if (trimmedEmail.toLowerCase() !== initialProfile.email.toLowerCase()) {
      changes.push('Email');
    }
    if (trimmedAvatarUri !== initialProfile.avatarUri) {
      changes.push('Photo de profil');
    }
    if (hasPasswordChanged) {
      changes.push('Mot de passe');
    }
    return changes;
  }, [
    hasPasswordChanged,
    initialProfile.avatarUri,
    initialProfile.email,
    initialProfile.firstName,
    initialProfile.lastName,
    trimmedAvatarUri,
    trimmedEmail,
    trimmedFirstName,
    trimmedLastName,
  ]);

  const hasChanges = changedFields.length > 0;
  const canSave = fieldErrors.length === 0 && hasChanges && !isImageActionLoading;

  const handlePickFromGallery = async () => {
    if (isImageActionLoading) {
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setFeedback({
        kind: 'error',
        message: 'Permission galerie refusee. Active la permission puis reessaie.',
      });
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
        setFeedback({
          kind: 'success',
          message: 'Nouvelle photo chargee depuis la galerie. N oublie pas de sauvegarder.',
        });
      }
    } catch {
      setFeedback({
        kind: 'error',
        message: 'Impossible de recuperer une photo depuis la galerie.',
      });
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
      setFeedback({
        kind: 'error',
        message: 'Permission camera refusee. Active la permission puis reessaie.',
      });
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
        setFeedback({
          kind: 'success',
          message: 'Photo capturee avec succes. N oublie pas de sauvegarder.',
        });
      }
    } catch {
      setFeedback({
        kind: 'error',
        message: 'Impossible d ouvrir la camera.',
      });
    } finally {
      setImageActionLoading(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUri('');
    setFeedback({
      kind: 'info',
      message: 'Photo supprimee. Les initiales seront affichees apres sauvegarde.',
    });
  };

  const handleReset = () => {
    setFirstName(initialProfile.firstName);
    setLastName(initialProfile.lastName);
    setEmail(initialProfile.email);
    setAvatarUri(initialProfile.avatarUri);
    setPassword('');
    setConfirmPassword('');
    setFeedback({
      kind: 'info',
      message: 'Toutes les modifications en cours ont ete annulees.',
    });
  };

  const handleSave = () => {
    if (!hasChanges) {
      setFeedback({
        kind: 'info',
        message: 'Aucune modification detectee.',
      });
      return;
    }
    if (fieldErrors.length > 0) {
      setFeedback({
        kind: 'error',
        message: fieldErrors[0],
      });
      return;
    }

    updateProfile({
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      email: trimmedEmail,
      password: hasPasswordChanged ? password : initialProfile.password,
      avatarUri: trimmedAvatarUri,
    });

    setPassword('');
    setConfirmPassword('');
    setFeedback({
      kind: 'success',
      message: `Profil enregistre. ${changedFields.length} champ(s) mis a jour.`,
    });
  };

  return (
    <AuthScreenLayout>
      <View className="flex-1 py-4">
        <Pressable
          accessibilityLabel="Ouvrir le menu"
          className="absolute right-0 top-0 z-10 h-10 w-10 items-center justify-center rounded-lg bg-white"
          onPress={() => setSidebarVisible(true)}>
          <Feather color="#0f172a" name="menu" size={20} />
        </Pressable>

        <DashboardSidebar
          currentScreen="account"
          email={profile.email}
          fullName={`${profile.firstName} ${profile.lastName}`.trim()}
          isVisible={isSidebarVisible}
          onClose={() => setSidebarVisible(false)}
          onOpenAccount={() => setSidebarVisible(false)}
          onOpenDashboard={() => {
            setSidebarVisible(false);
            router.replace('/(tabs)');
          }}
          onLogout={() => {
            setSidebarVisible(false);
            router.replace('/login');
          }}
        />

        <Text className="text-3xl font-bold text-slate-900">Mon compte</Text>
        <Text className="mt-2 text-sm leading-5 text-slate-600">
          Mets a jour ta photo, tes informations personnelles et ton mot de passe. Les changements
          ne sont appliques qu apres validation.
        </Text>

        {feedback ? (
          <View
            className={`mt-4 rounded-2xl border px-4 py-3 ${
              feedback.kind === 'success'
                ? 'border-emerald-200 bg-emerald-50'
                : feedback.kind === 'error'
                  ? 'border-red-200 bg-red-50'
                  : 'border-slate-200 bg-slate-100'
            }`}>
            <Text
              className={`text-sm ${
                feedback.kind === 'success'
                  ? 'text-emerald-700'
                  : feedback.kind === 'error'
                    ? 'text-red-700'
                    : 'text-slate-700'
              }`}>
              {feedback.message}
            </Text>
          </View>
        ) : null}

        <AppCard className="mt-5">
          <Text className="text-lg font-bold text-slate-900">Photo de profil</Text>
          <Text className="mt-1 text-xs text-slate-500">
            Format conseille: photo carree et nette. Cette image sera affichee sur le dashboard.
          </Text>

          <View className="mt-4 items-center">
            <UserAvatar imageUri={trimmedAvatarUri || undefined} name={fullName || 'Utilisateur'} size={88} />
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
            <AuthPrimaryButton
              disabled={isImageActionLoading || !trimmedAvatarUri}
              label="Supprimer la photo"
              onPress={handleRemoveAvatar}
              variant="secondary"
            />
          </View>
        </AppCard>

        <AppCard className="mt-4">
          <Text className="text-lg font-bold text-slate-900">Informations personnelles</Text>
          <Text className="mt-1 text-xs text-slate-500">
            Utilise des informations exactes pour faciliter la recuperation de compte.
          </Text>

          <View className="mt-4">
            <FieldLabel label="Prenom" />
            <AuthInput autoCapitalize="words" onChangeText={setFirstName} placeholder="Prenom" value={firstName} />
            {trimmedFirstName && trimmedFirstName.length < 2 ? (
              <FieldHelp error text="Le prenom doit contenir au moins 2 caracteres." />
            ) : (
              <FieldHelp text="Exemple: Marie" />
            )}
          </View>

          <View className="mt-4">
            <FieldLabel label="Nom" />
            <AuthInput autoCapitalize="words" onChangeText={setLastName} placeholder="Nom" value={lastName} />
            {trimmedLastName && trimmedLastName.length < 2 ? (
              <FieldHelp error text="Le nom doit contenir au moins 2 caracteres." />
            ) : (
              <FieldHelp text="Exemple: Dupont" />
            )}
          </View>

          <View className="mt-4">
            <FieldLabel label="Adresse email" />
            <AuthInput
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="Adresse email"
              value={email}
            />
            {trimmedEmail && !EMAIL_REGEX.test(trimmedEmail) ? (
              <FieldHelp error text="Le format de l email est invalide." />
            ) : (
              <FieldHelp text="Exemple: prenom.nom@email.com" />
            )}
          </View>
        </AppCard>

        <AppCard className="mt-4">
          <Text className="text-lg font-bold text-slate-900">Securite</Text>
          <Text className="mt-1 text-xs text-slate-500">
            Laisse vide si tu ne veux pas changer ton mot de passe.
          </Text>

          <View className="mt-4">
            <FieldLabel label="Nouveau mot de passe (optionnel)" />
            <AuthInput
              onChangeText={setPassword}
              placeholder="Nouveau mot de passe"
              secureTextEntry
              value={password}
            />
            {hasPasswordChanged && password.length < 6 ? (
              <FieldHelp error text="Minimum 6 caracteres." />
            ) : (
              <FieldHelp text="Conseil: melange lettres, chiffres et symbole." />
            )}
          </View>

          <View className="mt-4">
            <FieldLabel label="Confirmer le nouveau mot de passe" />
            <AuthInput
              onChangeText={setConfirmPassword}
              placeholder="Confirmer le mot de passe"
              secureTextEntry
              value={confirmPassword}
            />
            {hasPasswordChanged && confirmPassword !== password ? (
              <FieldHelp error text="La confirmation doit etre identique." />
            ) : (
              <FieldHelp text="Saisis la meme valeur pour valider le changement." />
            )}
          </View>
        </AppCard>

        <AppCard className="mt-4">
          <Text className="text-lg font-bold text-slate-900">Resume des modifications</Text>
          {changedFields.length > 0 ? (
            <View className="mt-3">
              <Text className="text-sm text-slate-700">
                Champs modifies: {changedFields.join(', ')}.
              </Text>
            </View>
          ) : (
            <Text className="mt-3 text-sm text-slate-500">Aucune modification en attente.</Text>
          )}
        </AppCard>

        <View className="mt-5 gap-3 pb-4">
          <AuthPrimaryButton disabled={!canSave} label="Enregistrer les modifications" onPress={handleSave} />
          <AuthPrimaryButton
            disabled={!hasChanges || isImageActionLoading}
            label="Reinitialiser les modifications"
            onPress={handleReset}
            variant="secondary"
          />
          <Pressable className="items-center py-2" onPress={() => router.back()}>
            <Text className="text-base font-medium text-slate-700">Retour</Text>
          </Pressable>
        </View>
      </View>
    </AuthScreenLayout>
  );
}
