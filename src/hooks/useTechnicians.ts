import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchTechnicians,
  createTechnician,
  updateTechnician,
  deleteTechnician,
  setSelectedTechnician,
  clearSelectedTechnician,
} from '../store/slices/technicianSlice';
import type { Technician, TechnicianStatus } from '../types';

export const useTechnicians = () => {
  const dispatch = useAppDispatch();
  const { items, selectedItem, loading, error, total, page, limit } =
    useAppSelector((s) => s.technicians);

  return {
    technicians: items,
    selected:    selectedItem,
    isLoading:   loading,
    error,
    total,
    page,
    limit,

    fetchAll: (params?: {
      page?: number;
      limit?: number;
      status?: TechnicianStatus;
      search?: string;
    }) => dispatch(fetchTechnicians(params ?? {})),

    create:   (data: Partial<Technician>) => dispatch(createTechnician(data)),
    update:   (id: string, data: Partial<Technician>) =>
      dispatch(updateTechnician({ id, data })),
    remove:   (id: string) => dispatch(deleteTechnician(id)),
    select:   (t: Technician) => dispatch(setSelectedTechnician(t)),
    deselect: ()              => dispatch(clearSelectedTechnician()),
  };
};
