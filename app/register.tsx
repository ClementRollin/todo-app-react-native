import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { AuthFooterLink } from '@/components/auth/auth-footer-link';
import { AuthInput } from '@/components/auth/auth-input';
import { AuthPrimaryButton } from '@/components/auth/auth-primary-button';
import { AuthScreenLayout } from '@/components/auth/auth-screen-layout';
import { useUser } from '@/contexts/user-context';

export default function RegistrationScreen() {
  const router = useRouter();
  const { isAuthenticated, isHydrated, register } = useUser();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isFormValid = useMemo(
    () =>
      Boolean(firstName.trim()) &&
      Boolean(lastName.trim()) &&
      Boolean(email.trim()) &&
      Boolean(password) &&
      Boolean(confirmPassword),
    [confirmPassword, email, firstName, lastName, password]
  );

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isHydrated, router]);

  const handleRegister = async () => {
    if (!isFormValid) {
      Alert.alert('Champs manquants', 'Merci de remplir tous les champs.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Mot de passe invalide', 'Le mot de passe et sa confirmation doivent correspondre.');
      return;
    }

    const result = await register({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password,
      avatarUri: '',
    });

    if (!result.ok) {
      Alert.alert('Inscription impossible', result.error ?? 'Une erreur est survenue.');
      return;
    }

    router.replace('/(tabs)');
  };

  return (
    <AuthScreenLayout>
      <View className="flex-1 py-6">
        <View className="mt-16 items-center">
          <Text className="text-center text-3xl font-bold text-slate-900">Bienvenue</Text>
          <Text className="mt-5 max-w-[280px] text-center text-base leading-6 text-slate-700">
            Cree ton compte pour commencer a organiser tes taches.
          </Text>
        </View>

        <View className="mt-10 gap-4">
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
          <AuthInput
            onChangeText={setConfirmPassword}
            placeholder="Confirmer le mot de passe"
            secureTextEntry
            value={confirmPassword}
          />
        </View>

        <View className="mt-auto">
          <AuthPrimaryButton disabled={!isFormValid} label="S'inscrire" onPress={handleRegister} />
          <View className="mt-6">
            <AuthFooterLink
              actionText="Se connecter"
              onPress={() => router.push('/login')}
              prefixText="Deja un compte ?"
            />
          </View>
        </View>
      </View>
    </AuthScreenLayout>
  );
}
