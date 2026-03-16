import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
  setSelectedService,
  clearSelectedService,
} from '../store/slices/serviceSlice';
import type { Service } from '../types';

export const useServices = () => {
  const dispatch = useAppDispatch();
  const { items, selectedItem, loading, error, total, page, limit } =
    useAppSelector((s) => s.services);

  return {
    services:  items,
    selected:  selectedItem,
    isLoading: loading,
    error,
    total,
    page,
    limit,

    fetchAll:     (params?: { page?: number; limit?: number; search?: string }) =>
      dispatch(fetchServices(params ?? {})),

    create:       (data: Partial<Service>) => dispatch(createService(data)),
    update:       (id: string, data: Partial<Service>) =>
      dispatch(updateService({ id, data })),
    remove:       (id: string) => dispatch(deleteService(id)),
    toggleStatus: (id: string) => dispatch(toggleServiceStatus(id)),
    select:       (s: Service) => dispatch(setSelectedService(s)),
    deselect:     ()           => dispatch(clearSelectedService()),
  };
};
