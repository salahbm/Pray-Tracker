import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';

import Loader from '@/components/shared/loader';
import NoData from '@/components/shared/no-data';
import { Text } from '@/components/ui/text';
import { useGetUsersList } from '@/hooks/awards/useGetUsers';
import { cn } from '@/lib/utils';
import { User } from '@/types/user';

export default function Leaderboard() {
  const { data, isLoading } = useGetUsersList();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <React.Fragment>
      <Loader visible={isLoading} className="bg-transparent" />

      <FlatList
        data={data}
        keyExtractor={(user) => user.id.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => setSelectedUser(item)}>
            <View
              className={cn(
                'flex-row items-center justify-between px-4 py-3 rounded-lg border',
                index === 0
                  ? 'bg-muted border-primary'
                  : 'bg-popover border-border opacity-90',
              )}
            >
              <Text className="text-lg font-semibold">{index + 1}.</Text>
              <Text className="text-lg font-semibold">{item.username}</Text>
              <Text className="text-lg">{item.totalPoints} pts</Text>
            </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
        className="my-4"
        contentContainerStyle={{ gap: 8 }}
        ListEmptyComponent={() => <NoData className="mt-[45%]" />}
      />

      {/* User Details Modal */}
      <Modal
        isVisible={!!selectedUser}
        onBackdropPress={() => setSelectedUser(null)}
      >
        <View className="bg-background p-6 rounded-lg flex-row gap-4 items-center py-8">
          <Image
            source={{ uri: selectedUser?.photo }}
            className="w-16 h-16 rounded-full border border-border"
          />
          <View>
            <Text className="text-xl font-bold">{selectedUser?.username}</Text>
            <Text className="text-lg text-muted-foreground">
              Points: {selectedUser?.totalPoints}
            </Text>
            <Text className="text-sm text-muted-foreground">
              {selectedUser?.firstName} {selectedUser?.lastName}
            </Text>
          </View>
        </View>
      </Modal>
    </React.Fragment>
  );
}
