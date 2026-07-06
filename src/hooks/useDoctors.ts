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

  const getAIStaffingImpact = useCallback(async (absents: Doctor[]) => {
    try {
      const { LocalSettingsRepository } = await import('../repositories/LocalSettingsRepository');
      const settingsRepo = new LocalSettingsRepository();
      const settings = await settingsRepo.getSettings();

      if (settings.mode === 'live') {
        const response = await fetch('/api/copilot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-gemini-api-key': settings.apiKey,
          },
          body: JSON.stringify({
            action: 'attendance',
            payload: {
              absentDoctors: absents,
            },
          }),
        });

        const data = await response.json();
        if (data.success && data.data) {
          return {
            waitTimeIncrease: data.data.waitTimeIncrease,
            riskAreas: data.data.riskAreas,
            recommendations: data.data.recommendations,
            fallback: false,
          };
        }
      }
    } catch (e) {
      console.error('Error fetching AI staffing impact:', e);
    }

    // Simulator Fallback
    const simulatedWait = absents.length * 15 + 5;
    const simulatedDepts = Array.from(new Set(absents.map((d) => d.department))).join(', ');
    const simulatedRecs = absents.map((doc) => {
      let rec = `${doc.department} Cover: ${doc.name} (${doc.department}, ${doc.shift}) is ${doc.status.replace('_', ' ').toUpperCase()}.`;
      if (doc.department === 'Pediatrics') {
        rec += ' Suggest asking Dr. Preeti Patel to extend hours or opening an additional nurse triage register.';
      } else if (doc.department === 'General OPD') {
        rec += ' Recommend reallocating Gynecological or Dental specialists to handle general minor cases.';
      } else if (doc.department === 'Gynecology') {
        rec += ' Cover critical cases via nearby CHC or on-call emergency services.';
      } else if (doc.department === 'Dental') {
        rec += ' Suggest rescheduling elective dental follow-ups to tomorrow.';
      } else {
        rec += ' Cover via standard emergency protocols.';
      }
      return rec;
    });

    return {
      waitTimeIncrease: simulatedWait,
      riskAreas: simulatedDepts || 'None',
      recommendations: simulatedRecs,
      fallback: true,
    };
  }, []);

  return {
    doctors,
    loading,
    stats,
    absentDoctors,
    toggleAttendance,
    getAIStaffingImpact,
    refresh: fetchDoctors,
  };
}
