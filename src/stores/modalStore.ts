import { create } from 'zustand';

interface ModalState {
  // Modal visibility states
  modals: {
    addRecord: boolean;
    shareRecord: boolean;
    addPatient: boolean;
    editPatient: boolean;
    createAppointment: boolean;
    rescheduleAppointment: boolean;
    cancelAppointment: boolean;
    sendMessage: boolean;
    createPrescription: boolean;
    editPrescription: boolean;
    createTask: boolean;
    editTask: boolean;
    createTemplate: boolean;
    editTemplate: boolean;
    userProfile: boolean;
    settings: boolean;
    notifications: boolean;
    confirmDialog: boolean;
    integrationSetup: boolean;
    telehealthSession: boolean;
    fileUpload: boolean;
    patientSearch: boolean;
    providerSearch: boolean;
    recordDetails: boolean;
    appointmentDetails: boolean;
    prescriptionDetails: boolean;
    taskDetails: boolean;
  };

  // Modal data
  modalData: {
    confirmDialog: {
      title: string;
      message: string;
      type: 'danger' | 'warning' | 'info' | 'success';
      onConfirm: () => void;
      confirmText?: string;
      cancelText?: string;
    } | null;
    selectedRecord: string | null;
    selectedPatient: string | null;
    selectedAppointment: string | null;
    selectedPrescription: string | null;
    selectedTask: string | null;
    editingItem: any | null;
  };

  // Actions
  openModal: (modalName: keyof ModalState['modals'], data?: any) => void;
  closeModal: (modalName: keyof ModalState['modals']) => void;
  closeAllModals: () => void;
  setModalData: (key: keyof ModalState['modalData'], value: any) => void;
  showConfirmDialog: (config: {
    title: string;
    message: string;
    type?: 'danger' | 'warning' | 'info' | 'success';
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
  }) => void;
}

export const useModalStore = create<ModalState>((set, get) => ({
  modals: {
    addRecord: false,
    shareRecord: false,
    addPatient: false,
    editPatient: false,
    createAppointment: false,
    rescheduleAppointment: false,
    cancelAppointment: false,
    sendMessage: false,
    createPrescription: false,
    editPrescription: false,
    createTask: false,
    editTask: false,
    createTemplate: false,
    editTemplate: false,
    userProfile: false,
    settings: false,
    notifications: false,
    confirmDialog: false,
    integrationSetup: false,
    telehealthSession: false,
    fileUpload: false,
    patientSearch: false,
    providerSearch: false,
    recordDetails: false,
    appointmentDetails: false,
    prescriptionDetails: false,
    taskDetails: false,
  },

  modalData: {
    confirmDialog: null,
    selectedRecord: null,
    selectedPatient: null,
    selectedAppointment: null,
    selectedPrescription: null,
    selectedTask: null,
    editingItem: null,
  },

  openModal: (modalName, data) => {
    set((state) => ({
      modals: { ...state.modals, [modalName]: true },
      modalData: data ? { ...state.modalData, editingItem: data } : state.modalData
    }));
  },

  closeModal: (modalName) => {
    set((state) => ({
      modals: { ...state.modals, [modalName]: false },
      modalData: modalName === 'confirmDialog' 
        ? { ...state.modalData, confirmDialog: null }
        : state.modalData
    }));
  },

  closeAllModals: () => {
    set((state) => ({
      modals: Object.keys(state.modals).reduce((acc, key) => ({
        ...acc,
        [key]: false
      }), {} as ModalState['modals']),
      modalData: {
        confirmDialog: null,
        selectedRecord: null,
        selectedPatient: null,
        selectedAppointment: null,
        selectedPrescription: null,
        selectedTask: null,
        editingItem: null,
      }
    }));
  },

  setModalData: (key, value) => {
    set((state) => ({
      modalData: { ...state.modalData, [key]: value }
    }));
  },

  showConfirmDialog: (config) => {
    set((state) => ({
      modals: { ...state.modals, confirmDialog: true },
      modalData: { ...state.modalData, confirmDialog: config }
    }));
  },
}));