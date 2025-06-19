import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CounterButtonsProps {
  currentCount: number;
  targetCount: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onReset: () => void;
  onComplete: () => void;
  isUpdating: boolean;
}

export default function CounterButtons({
  currentCount,
  targetCount,
  onIncrease,
  onDecrease,
  onReset,
  onComplete,
  isUpdating
}: CounterButtonsProps) {
  const isCompleted = currentCount >= targetCount;

  // Use Pressable on Android and TouchableOpacity on iOS for better performance
  const ButtonComponent = Platform.OS === 'ios' ? TouchableOpacity : TouchableOpacity;

  return (
    <View style={styles.container}>
      {/* Primary Counter Buttons */}
      <View style={styles.primaryButtonsContainer}>
        <ButtonComponent
          style={[styles.counterButton, styles.decreaseButton]}
          onPress={onDecrease}
          disabled={currentCount <= 0 || isUpdating}
          activeOpacity={0.7}
        >
          <Feather name="minus" size={28} color={currentCount <= 0 ? "#d1d5db" : "#6b7280"} />
        </ButtonComponent>
        
        <ButtonComponent
          style={[styles.counterButton, styles.increaseButton]}
          onPress={onIncrease}
          disabled={isCompleted || isUpdating}
          activeOpacity={0.7}
        >
          <Feather name="plus" size={28} color={isCompleted ? "#d1d5db" : "white"} />
        </ButtonComponent>
      </View>
      
      {/* Secondary Action Buttons */}
      <View style={styles.secondaryButtonsContainer}>
        <ButtonComponent
          style={styles.actionButton}
          onPress={onReset}
          activeOpacity={0.7}
        >
          <Feather name="refresh-cw" size={16} color="#6b7280" />
          <Text style={styles.actionButtonText}>Reset</Text>
        </ButtonComponent>
        
        <ButtonComponent
          style={styles.actionButton}
          onPress={onComplete}
          disabled={isCompleted}
          activeOpacity={0.7}
        >
          <Feather name="check-circle" size={16} color={isCompleted ? "#d1d5db" : "#6b7280"} />
          <Text style={[styles.actionButtonText, isCompleted && styles.disabledText]}>Complete</Text>
        </ButtonComponent>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  primaryButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  counterButton: {
    width: '48%',
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  decreaseButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  increaseButton: {
    backgroundColor: '#8b5cf6',
  },
  secondaryButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: '48%',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
  },
  disabledText: {
    color: '#d1d5db',
  },
}); 