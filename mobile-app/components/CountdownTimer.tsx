"use client"

// File: app/components/CountdownTimer.tsx

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Text, View, StyleSheet, Animated } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

interface CountdownTimerProps {
  targetDate: string | Date // ISO string or Date object
  onComplete?: () => void
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, onComplete }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date()
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    return timeLeft
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  const secondsAnim = useRef(new Animated.Value(1)).current

  // Animation for seconds changing
  useEffect(() => {
    Animated.sequence([
      Animated.timing(secondsAnim, {
        toValue: 1.2,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(secondsAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }, [timeLeft.seconds])

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)

      const totalSeconds =
        newTimeLeft.days * 86400 + newTimeLeft.hours * 3600 + newTimeLeft.minutes * 60 + newTimeLeft.seconds

      if (totalSeconds <= 0) {
        clearInterval(timer)
        if (onComplete) onComplete()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const formatNumber = (num: number) => {
    return num < 10 ? `0${num}` : num
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#4F46E5", "#818CF8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.timeUnits}>
          {timeLeft.days > 0 && (
            <View style={styles.timeUnit}>
              <Text style={styles.timeValue}>{formatNumber(timeLeft.days)}</Text>
              <Text style={styles.timeLabel}>d</Text>
            </View>
          )}
          <View style={styles.timeUnit}>
            <Text style={styles.timeValue}>{formatNumber(timeLeft.hours)}</Text>
            <Text style={styles.timeLabel}>h</Text>
          </View>
          <View style={styles.timeUnit}>
            <Text style={styles.timeValue}>{formatNumber(timeLeft.minutes)}</Text>
            <Text style={styles.timeLabel}>m</Text>
          </View>
          <View style={styles.timeUnit}>
            <Animated.Text style={[styles.timeValue, { transform: [{ scale: secondsAnim }] }]}>
              {formatNumber(timeLeft.seconds)}
            </Animated.Text>
            <Text style={styles.timeLabel}>s</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
  },
  gradient: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  timeUnits: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  timeUnit: {
    flexDirection: "row",
    alignItems: "baseline",
    marginHorizontal: 4,
  },
  timeValue: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  timeLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    marginLeft: 2,
  },
})

export default CountdownTimer
