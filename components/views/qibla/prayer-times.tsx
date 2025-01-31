import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import { format } from 'date-fns';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';
import { View, Text, Alert, FlatList } from 'react-native';

import Loader from '@/components/shared/loader';
import NoData from '@/components/shared/no-data';
import { SALAHS } from '@/constants/enums';
import useTimeLeft from '@/hooks/common/useTimeLeft';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/defaults/theme';

const PrayerTimer = () => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [location, setLocation] = useState('Fetching location...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { colors } = useThemeStore();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to calculate prayer times.',
        );
        setError(true);
        setLoading(false);
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      const coordinates = new Coordinates(
        userLocation.coords.latitude,
        userLocation.coords.longitude,
      );
      const params = CalculationMethod.MoonsightingCommittee();
      const date = new Date();
      setPrayerTimes(new PrayerTimes(coordinates, date, params));

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const { city, region, country } = reverseGeocode[0];
        setLocation(
          `${city || 'Unknown'}, ${region || 'Unknown'}, ${country || 'Unknown'}`,
        );
      }

      setLoading(false);
    })();
  }, []);

  const { timeLeft, currentPrayer } = useTimeLeft(prayerTimes);

  const prayers = [
    {
      name: SALAHS.FAJR,
      time: prayerTimes?.fajr,
      icon: 'weather-sunset-up',
    },
    {
      name: SALAHS.SUNRISE,
      time: prayerTimes?.sunrise,
      icon: 'weather-sunny',
    },
    {
      name: SALAHS.DHUHR,
      time: prayerTimes?.dhuhr,
      icon: 'weather-sunny-alert',
    },
    {
      name: SALAHS.ASR,
      time: prayerTimes?.asr,
      icon: 'weather-partly-cloudy',
    },
    {
      name: SALAHS.MAGHRIB,
      time: prayerTimes?.maghrib,
      icon: 'weather-sunset-down',
    },
    {
      name: SALAHS.ISHA,
      time: prayerTimes?.isha,
      icon: 'weather-night',
    },
  ];

  if (loading) {
    return <Loader visible className="mt-[45%]" />;
  }

  if (error || !prayerTimes) {
    return <NoData className="mt-[45%]" />;
  }
  return (
    <View className="py-4 h-full">
      <View className="bg-accent p-6 rounded-2xl mb-6 shadow-lg">
        <Text className="text-accent-foreground text-5xl font-extrabold text-center">
          {timeLeft}
        </Text>
        <Text className="text-muted text-sm text-center">
          left until next prayer
        </Text>
        <Text className="text-foreground text-lg text-center mt-3">
          {location}
        </Text>
      </View>

      <FlatList
        data={prayers}
        keyExtractor={(item) => item.name}
        ListEmptyComponent={() => <NoData className="mt-[45%]" />}
        renderItem={({ item }) => {
          const currentSalah = item?.name === currentPrayer;
          return (
            <View
              className={cn(
                'flex-row justify-between items-center p-5 rounded-xl mb-3',
                currentSalah ? 'bg-accent shadow-sm' : 'bg-border',
              )}
            >
              <Icon
                name={item.icon as 'weather-sunset-up' | 'weather-sunny'}
                size={24}
                color={
                  currentSalah
                    ? colors['--accent-foreground']
                    : colors['--foreground']
                }
              />
              <Text
                className={cn(
                  'text-lg font-semibold capitalize',
                  currentSalah ? 'text-accent-foreground' : 'text-foreground',
                )}
              >
                {item?.name}
              </Text>
              <Text
                className={cn(
                  'text-lg font-semibold',
                  currentSalah ? 'text-accent-foreground' : 'text-foreground',
                )}
              >
                {item?.time && format(item?.time, 'HH:mm')}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default PrayerTimer;
