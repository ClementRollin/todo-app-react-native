import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

import { AuthFooterLink } from '@/components/auth/auth-footer-link';
import { AuthIllustration } from '@/components/auth/auth-illustration';
import { AuthInput } from '@/components/auth/auth-input';
import { AuthPrimaryButton } from '@/components/auth/auth-primary-button';
import { AuthScreenLayout } from '@/components/auth/auth-screen-layout';
import { useUser } from '@/contexts/user-context';

export default function LoginScreen() {
  const router = useRouter();
  const { profile } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isFormValid = useMemo(() => Boolean(email.trim()) && Boolean(password), [email, password]);

  const handleLogin = () => {
    if (!isFormValid) {
      Alert.alert('Champs manquants', 'Merci de saisir ton email et ton mot de passe.');
      return;
    }

    if (email.trim().toLowerCase() !== profile.email.trim().toLowerCase() || password !== profile.password) {
      Alert.alert('Identifiants invalides', 'Email ou mot de passe incorrect.');
      return;
    }

    router.replace('/(tabs)');
  };

  return (
    <AuthScreenLayout>
      <View className="flex-1 py-6">
        <View className="mt-14 items-center">
          <Text className="text-center text-3xl font-bold text-slate-900">Bon retour</Text>
          <View className="mt-6">
            <AuthIllustration variant="welcome" />
          </View>
        </View>

        <View className="mt-10 gap-4">
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

        <Pressable
          className="mt-6 items-center"
          onPress={() => Alert.alert('Information', 'Fonction bientot disponible.')}>
          <Text className="text-base text-brand-500">Mot de passe oublie ?</Text>
        </Pressable>

        <View className="mt-auto">
          <AuthPrimaryButton disabled={!isFormValid} label="Connexion" onPress={handleLogin} />
          <View className="mt-6">
            <AuthFooterLink
              actionText="S'inscrire"
              onPress={() => router.push('/register')}
              prefixText="Pas encore de compte ?"
            />
          </View>
        </View>
      </View>
    </AuthScreenLayout>
  );
}
