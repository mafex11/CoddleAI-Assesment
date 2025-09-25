import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BabyProfile } from '../types';
import { formatAge, calculateAgeInDays } from '../utils/calculations';
import BabyProfileEdit from './BabyProfileEdit';
import BabySetup from './BabySetup';

interface HeaderProps {
  babyProfile: BabyProfile;
  onAddMeasurement: () => void;
  onProfileUpdated: (profile: BabyProfile) => void;
  onAddNewBaby?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  babyProfile,
  onAddMeasurement,
  onProfileUpdated,
  onAddNewBaby,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showNewBaby, setShowNewBaby] = useState(false);
  
  const currentAge = formatAge(
    calculateAgeInDays(babyProfile.birthDate, new Date().toISOString())
  );

  const handleProfileMenuPress = () => {
    setShowProfileMenu(true);
  };

  const handleEditProfile = () => {
    setShowProfileMenu(false);
    setShowEditProfile(true);
  };

  const handleAddNewBaby = () => {
    setShowProfileMenu(false);
    setShowNewBaby(true);
  };

  const handleProfileSaved = (updatedProfile: BabyProfile) => {
    setShowEditProfile(false);
    onProfileUpdated(updatedProfile);
  };

  const handleNewBabyCreated = (newBaby: BabyProfile) => {
    setShowNewBaby(false);
    onProfileUpdated(newBaby);
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <View style={styles.babyInfo}>
          <View style={styles.babyIcon}>
            <Ionicons
              name={babyProfile.gender === 'male' ? 'male' : 'female'}
              size={24}
              color="#fff"
            />
          </View>
          <View style={styles.babyDetails}>
            <Text style={styles.babyName}>{babyProfile.name}</Text>
            <Text style={styles.babyAge}>{currentAge} old</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleProfileMenuPress}
          >
            <Ionicons name="person-circle" size={20} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={onAddMeasurement}
          >
            <Ionicons name="add" size={24} color="#667eea" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Menu Modal */}
      <Modal
        visible={showProfileMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowProfileMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setShowProfileMenu(false)}
        >
          <View style={styles.profileMenu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleEditProfile}
            >
              <Ionicons name="pencil" size={20} color="#667eea" />
              <Text style={styles.menuItemText}>Edit Baby Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleAddNewBaby}
            >
              <Ionicons name="add-circle" size={20} color="#10b981" />
              <Text style={styles.menuItemText}>Add New Baby</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.menuItem, styles.cancelMenuItem]}
              onPress={() => setShowProfileMenu(false)}
            >
              <Ionicons name="close" size={20} color="#ef4444" />
              <Text style={[styles.menuItemText, styles.cancelText]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Baby Profile Edit Modal */}
      <BabyProfileEdit
        babyProfile={babyProfile}
        visible={showEditProfile}
        onSave={handleProfileSaved}
        onCancel={() => setShowEditProfile(false)}
      />

      {/* New Baby Setup Modal */}
      {showNewBaby && (
        <Modal
          visible={showNewBaby}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowNewBaby(false)}
        >
          <BabySetup onBabyCreated={handleNewBabyCreated} />
        </Modal>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  babyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  babyIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  babyDetails: {
    flex: 1,
  },
  babyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  babyAge: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileMenu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  cancelMenuItem: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 4,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  cancelText: {
    color: '#ef4444',
  },
});

export default Header;

