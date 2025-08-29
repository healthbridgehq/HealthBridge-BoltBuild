import { create } from 'zustand';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface AppState {
  // Global state
  notifications: Notification[];
  sidebarCollapsed: boolean;
  currentTheme: 'light' | 'dark';
  
  // Loading states
  loading: {
    appointments: boolean;
    records: boolean;
    patients: boolean;
    prescriptions: boolean;
    messages: boolean;
  };
  
  // Modal states
  modals: {
    addRecord: boolean;
    shareRecord: boolean;
    addPatient: boolean;
    createAppointment: boolean;
    sendMessage: boolean;
    createPrescription: boolean;
  };
  
  // Form data
  selectedItems: {
    records: string[];
    patients: string[];
    appointments: string[];
  };
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLoading: (key: keyof AppState['loading'], value: boolean) => void;
  toggleModal: (key: keyof AppState['modals'], value?: boolean) => void;
  toggleItemSelection: (category: keyof AppState['selectedItems'], id: string) => void;
  clearSelection: (category: keyof AppState['selectedItems']) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  notifications: [],
  sidebarCollapsed: false,
  currentTheme: 'light',
  loading: {
    appointments: false,
    records: false,
    patients: false,
    prescriptions: false,
    messages: false,
  },
  modals: {
    addRecord: false,
    shareRecord: false,
    addPatient: false,
    createAppointment: false,
    sendMessage: false,
    createPrescription: false,
  },
  selectedItems: {
    records: [],
    patients: [],
    appointments: [],
  },

  // Actions
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    }));
  },

  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      ),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
  },

  setTheme: (theme) => {
    set({ currentTheme: theme });
  },

  setLoading: (key, value) => {
    set((state) => ({
      loading: { ...state.loading, [key]: value },
    }));
  },

  toggleModal: (key, value) => {
    set((state) => ({
      modals: { ...state.modals, [key]: value ?? !state.modals[key] },
    }));
  },

  toggleItemSelection: (category, id) => {
    set((state) => {
      const currentSelection = state.selectedItems[category];
      const newSelection = currentSelection.includes(id)
        ? currentSelection.filter((item) => item !== id)
        : [...currentSelection, id];
      
      return {
        selectedItems: { ...state.selectedItems, [category]: newSelection },
      };
    });
  },

  clearSelection: (category) => {
    set((state) => ({
      selectedItems: { ...state.selectedItems, [category]: [] },
    }));
  },
}));