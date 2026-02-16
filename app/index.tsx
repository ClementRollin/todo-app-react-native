import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { AuthIllustration } from '@/components/auth/auth-illustration';
import { AuthPrimaryButton } from '@/components/auth/auth-primary-button';
import { AuthScreenLayout } from '@/components/auth/auth-screen-layout';

export default function SplashHomeScreen() {
  const router = useRouter();

  return (
    <AuthScreenLayout>
      <View className="flex-1 justify-between py-6">
        <View className="mt-16 items-center">
          <AuthIllustration variant="splash" />
          <Text className="mt-8 text-center text-3xl font-bold text-slate-900">
            Organise tes taches
          </Text>
          <Text className="mt-4 max-w-[300px] text-center text-base leading-6 text-slate-700">
            Planifie ta journee, priorise tes actions et avance avec constance.
          </Text>
        </View>

        <View className="gap-3">
          <AuthPrimaryButton label="Inscription" onPress={() => router.push('/register')} />
          <AuthPrimaryButton
            label="Connexion"
            onPress={() => router.push('/login')}
            variant="secondary"
          />
        </View>
      </View>
    </AuthScreenLayout>
  );
}
