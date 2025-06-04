import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Settings, Bell, Lock, HelpCircle, LogOut, User } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, layout } from '../../styles/shared';

const isWeb = Platform.OS === 'web';
const BlurContainer = isWeb ? View : BlurView;

export default function ProfileScreen() {
  const menuItems = [
    { icon: Settings, label: 'Settings', onPress: () => {} },
    { icon: Bell, label: 'Notifications', onPress: () => {} },
    { icon: Lock, label: 'Privacy', onPress: () => {} },
    { icon: HelpCircle, label: 'Help & Support', onPress: () => {} },
    { icon: LogOut, label: 'Logout', onPress: () => {}, danger: true },
  ];

  return (
    <LinearGradient
      colors={['#edcc9a', '#92ccce']}
      style={styles.gradientContainer}
    >
      {/* Fixed Header */}
      <View style={styles.header}>
        <BlurContainer intensity={80} tint="light" style={styles.headerContent}>
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={styles.title}>Profile</Text>
              <Text style={styles.subtitle}>Manage your account settings</Text>
            </View>
          </View>
        </BlurContainer>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
      >
        <BlurContainer intensity={80} tint="light" style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarInner}>
              <User size={40} color={colors.text.secondary} style={styles.userIcon} />
            </View>
          </View>
          <Text style={styles.name}>Dexter Mtetwa</Text>
          <Text style={styles.email}>hushrama@example.com</Text>
        </BlurContainer>

        <BlurContainer intensity={80} tint="light" style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, index < menuItems.length - 1 && styles.menuItemBorder]}
              onPress={item.onPress}
            >
              <item.icon size={24} color={item.danger ? '#ef4444' : colors.text.primary} />
              <Text style={[styles.menuItemText, item.danger && { color: '#ef4444' }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </BlurContainer>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: spacing.lg,
    backgroundColor: Platform.select({
      web: 'rgba(237, 204, 154, 0.95)',
      ios: colors.background.transparent,
      android: 'rgba(237, 204, 154, 0.95)',
    }),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...typography.title,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 4,
  },
  profileCard: {
    backgroundColor: Platform.select({
      web: 'rgba(255, 255, 255, 0.85)',
      ios: colors.background.transparent,
      android: '#ffffff',
    }),
    borderRadius: layout.borderRadius.large,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...Platform.select({
      ios: {
        ...layout.shadow.medium,
        overflow: 'hidden',
      },
      android: {
        elevation: 4,
        overflow: 'hidden',
      },
    }),
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Platform.select({
      web: 'rgba(255, 255, 255, 0.9)',
      ios: colors.background.transparent,
      android: '#ffffff',
    }),
    padding: 3,
    ...Platform.select({
      ios: layout.shadow.small,
      android: {
        elevation: 2,
      },
    }),
  },
  avatarInner: {
    flex: 1,
    borderRadius: 50,
    backgroundColor: 'rgba(146, 204, 206, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIcon: {
    opacity: 0.7,
  },
  name: {
    ...typography.title,
    color: colors.text.primary,
    marginTop: spacing.md,
    fontSize: 24,
  },
  email: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  menuContainer: {
    backgroundColor: Platform.select({
      web: 'rgba(255, 255, 255, 0.85)',
      ios: colors.background.transparent,
      android: '#ffffff',
    }),
    borderRadius: layout.borderRadius.large,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        ...layout.shadow.medium,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  menuItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: layout.borderRadius.medium,
    backgroundColor: Platform.select({
      web: 'rgba(255, 255, 255, 0.85)',
      ios: 'transparent',
      android: 'rgba(255, 255, 255, 0.85)',
      default: 'rgba(255, 255, 255, 0.85)',
    }),
    ...Platform.select({
      ios: layout.shadow.small,
      android: {
        elevation: 2,
      },
    }),
  },
  menuItemText: {
    ...typography.subtitle,
    color: colors.text.primary,
    marginLeft: spacing.md,
  },
});
