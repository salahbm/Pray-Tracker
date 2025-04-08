import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import GoBack from '@/components/shared/go-back';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { FRIENDS } from '@/constants/images';
import { useLogout } from '@/hooks/auth/useLogOut';
import { usePutUser } from '@/hooks/auth/usePutUser';
import { supabase } from '@/lib/supabase';
import { fireToast } from '@/providers/toaster';
import { useAuthStore } from '@/store/auth/auth-session';

const EditPwd = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { mutate: logOut, isPending } = useLogout();

  const { mutateAsync: updateUser, isPending: isLoading } = usePutUser();

  //   States
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const validatePasswords = () => {
    if (newPassword.length < 6) {
      fireToast.error('Password must be at least 6 characters.');
      return false;
    }
    if (newPassword !== confirmPassword) {
      fireToast.error('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    try {
      if (!validatePasswords()) return;

      if (newPassword) {
        await supabase.auth.updateUser({ password: newPassword });
        await updateUser({
          ...user,
          password: newPassword,
        });
      }
      // Log out the user after updating password
      logOut(undefined);
    } catch (error) {
      fireToast.error(error.message);
    }
  };

  return (
    <SafeAreaView className="main-area">
      <GoBack title={t('Profile.EditPassword.Title')} />
      <ScrollView keyboardShouldPersistTaps="handled">
        {user?.photo ? (
          <Image
            source={{ uri: user.photo }}
            accessibilityLabel="Profile Photo"
            className="w-[150px] h-[150px] rounded-full mx-auto border border-border max-w-[150px] max-h-[150px] mt-10"
          />
        ) : (
          <Image
            source={FRIENDS.guest}
            accessibilityLabel="Guest Profile"
            className="w-[150px] h-[150px] rounded-full mx-auto border border-border max-w-[150px] max-h-[150px] mt-10"
          />
        )}
        <View className="flex-1 gap-6">
          <Input
            label={t('Profile.EditPassword.Fields.NewPassword.Label')}
            placeholder={t(
              'Profile.EditPassword.Fields.NewPassword.Placeholder',
            )}
            autoCapitalize="none"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <Input
            label={t('Profile.EditPassword.Fields.ConfirmPassword.Label')}
            placeholder={t(
              'Profile.EditPassword.Fields.ConfirmPassword.Placeholder',
            )}
            autoCapitalize="none"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
      </ScrollView>
      <View className="pb-4">
        <Button onPress={handleUpdate} disabled={isLoading || isPending}>
          <Text>{t('Profile.EditPassword.SaveButton')}</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default EditPwd;
