import { User } from '@supabase/supabase-js';
import React, { useCallback, useEffect } from 'react';
import { Image, View } from 'react-native';

import { X } from '@/components/shared/icons';
import Modal from '@/components/shared/modal';
import { usePostUser } from '@/hooks/auth/usePostUser';
import { useThemeStore } from '@/store/defaults/theme';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Text } from 'components/ui/text';
import { IMAGES } from 'constants/images';

interface ISignUp {
  onSuccess: () => void;
  onNavigate: () => void;
}

export default function SignUpScreen({ onSuccess, onNavigate }: ISignUp) {
  const {
    supabaseSignUp,
    onPressVerify,
    postUser,
    isPostUserSuccess,
    isPendingSupabaseSignUp,
    isPendingOnPressVerify,
    isPendingPostUser,
  } = usePostUser();
  const { colors } = useThemeStore();
  const [form, setForm] = React.useState({
    email: '',
    username: '',
    password: '',
    token: '',
  });
  const [data, setData] = React.useState<User | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] =
    React.useState(isPostUserSuccess);
  const [showOtpModal, setShowOtpModal] = React.useState(false);

  // Handle sign-up process
  const onSignUpPress = async () => {
    try {
      setError(null);
      await supabaseSignUp(form);
      setShowOtpModal(true);
    } catch (err) {
      setError(err.message || 'Sign-up failed.');
    }
  };

  const handlePostUser = useCallback(async () => {
    const payload = {
      email: form.email,
      password: form.password,
      username: form.username,
      supabaseId: data.id,
    };

    await postUser(payload);

    setShowOtpModal(false);
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 150);

    // Clear input fields
    setData(null);
    setForm({
      email: '',
      username: '',
      password: '',
      token: '',
    });
  }, [data, form, postUser, setShowOtpModal, setShowSuccessModal]);

  // Handle email verification
  const handlePressVerify = async () => {
    try {
      setError(null);
      const res = await onPressVerify(form);

      if (res) {
        setData(res.user);
      }
    } catch (err) {
      setError(err.message || 'Verification failed.');
    }
  };

  useEffect(() => {
    if (data) {
      handlePostUser();
    }
  }, [data, handlePostUser]);

  return (
    <React.Fragment>
      <View className="w-full max-w-md mt-8">
        <Text className="text-3xl font-bold text-primary mb-2 text-center">
          Join Us
        </Text>
        <Text className="text-sm text-muted-foreground text-center mb-6">
          Create an account to continue
        </Text>

        <Input
          label="Email"
          autoCapitalize="none"
          className="mb-4"
          value={form.email}
          placeholder="Enter your email"
          keyboardType="email-address"
          onChangeText={(email) => setForm({ ...form, email })}
        />

        <Input
          label="Username"
          className="mb-4"
          value={form.username}
          placeholder="Enter your username"
          onChangeText={(username) => setForm({ ...form, username })}
        />

        <Input
          label="Password"
          className="mb-10"
          value={form.password}
          placeholder="Enter your password"
          secureTextEntry
          onChangeText={(password) => setForm({ ...form, password })}
        />

        <Button onPress={onSignUpPress} disabled={isPendingSupabaseSignUp}>
          <Text>Sign Up</Text>
        </Button>
        {error && <Text className="text-destructive mt-2">{error}</Text>}
      </View>

      <View className="mt-8 flex flex-row justify-center items-center gap-4">
        <Text className="text-sm text-muted-foreground text-center">
          Already have an account?
        </Text>
        <Button variant="link" onPress={onNavigate}>
          <Text>Sign In</Text>
        </Button>
      </View>

      {/* VERIFICATION MODAL */}
      <Modal isVisible={showOtpModal}>
        <View className="bg-muted px-7 py-14 rounded-2xl relative border border-border">
          <Button
            className="absolute top-2 right-0"
            variant="ghost"
            disabled={isPendingPostUser || isPendingOnPressVerify}
          >
            <X
              size={24}
              onPress={() => setShowOtpModal(false)}
              color={colors['--primary']}
            />
          </Button>
          <Text className="text-2xl font-bold mb-2">Verification</Text>
          <Text className="text-gray-600 mb-5">
            We&apos;ve sent a verification code to {form.email}.
          </Text>
          <Input
            placeholder="12345"
            className="p-3 rounded-lg bg-surface border border-border"
            value={form.token}
            keyboardType="numeric"
            onChangeText={(token) => setForm({ ...form, token })}
          />
          {error && (
            <Text className="text-destructive text-sm mt-2">{error}</Text>
          )}
          <Button
            onPress={handlePressVerify}
            className="mt-5"
            disabled={isPendingOnPressVerify || isPendingPostUser}
          >
            <Text>Verify Email</Text>
          </Button>
        </View>
      </Modal>

      {/* SUCCESS MODAL */}
      <Modal
        isVisible={showSuccessModal}
        onBackdropPress={() => {
          onSuccess();
          setShowSuccessModal(false);
        }}
      >
        <View className="bg-muted px-7 py-9 rounded-2xl min-h-[300px]">
          <Image
            source={IMAGES.check}
            className="w-[110px] h-[110px] mx-auto my-5"
          />
          <Text className="text-3xl font-bold text-center">Verified</Text>
          <Text className="text-base text-muted-foreground text-center mt-2">
            You have successfully verified your account.
          </Text>
          <Button
            onPress={() => {
              onSuccess();
              setShowSuccessModal(false);
            }}
            className="mt-5"
          >
            <Text>Sign In</Text>
          </Button>
        </View>
      </Modal>
    </React.Fragment>
  );
}
