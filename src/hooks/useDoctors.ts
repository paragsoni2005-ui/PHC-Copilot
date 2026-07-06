import { useState, useEffect, useCallback, useMemo } from 'react';
import { Doctor } from '@/types/store';
import { LocalDoctorRepository } from '../repositories/LocalDoctorRepository';

const repo = new LocalDoctorRepository();

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const data = await repo.getAll();
      setDoctors(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const toggleAttendance = useCallback(async (id: string) => {
    const doc = doctors.find((d) => d.id === id);
    if (!doc) return;
    const newStatus: Doctor['status'] = doc.status === 'present' ? 'absent' : 'present';
    const updated = await repo.updateStatus(id, newStatus);
    setDoctors((prev) => prev.map((d) => (d.id === id ? updated : d)));
  }, [doctors]);

  const stats = useMemo(() => {
    const total = doctors.length;
    // Count 'present' status vs others
    const presentCount = doctors.filter((d) => d.status === 'present').length;
    const absentCount = doctors.filter((d) => d.status === 'absent').length;
    const leaveCount = doctors.filter((d) => d.status === 'on_leave').length;
    const coveragePercent = total > 0 ? Math.round((presentCount / total) * 100) : 0;
    return {
      total,
      presentCount,
      absentCount,
      leaveCount,
      coveragePercent,
    };
  }, [doctors]);

  const absentDoctors = useMemo(() => {
    return doctors.filter((d) => d.status === 'absent');
  }, [doctors]);

  return {
    doctors,
    loading,
    stats,
    absentDoctors,
    toggleAttendance,
    refresh: fetchDoctors,
  };
}
