// File: app/components/CountdownTimer.tsx

import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface CountdownTimerProps {
  targetDate: string | Date; // ISO string or Date object
  onComplete?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, onComplete }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      const totalSeconds =
        newTimeLeft.days * 86400 +
        newTimeLeft.hours * 3600 +
        newTimeLeft.minutes * 60 +
        newTimeLeft.seconds;

      if (totalSeconds <= 0) {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#222',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CountdownTimer;
