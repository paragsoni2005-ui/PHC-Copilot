import { Doctor } from "@/types/store";

export const mockDoctors: Doctor[] = [
  {
    id: "doc-001",
    name: "Dr. Sarah Khan",
    department: "Pediatrics",
    status: "present",
    contact: "+91 98765 43210",
    specialty: "MD Pediatrics",
    shift: "morning",
  },
  {
    id: "doc-002",
    name: "Dr. Rajesh Sharma",
    department: "General OPD",
    status: "present",
    contact: "+91 87654 32109",
    specialty: "MD Medicine / General Physician",
    shift: "morning",
  },
  {
    id: "doc-003",
    name: "Dr. Anita Desai",
    department: "Gynecology",
    status: "present",
    contact: "+91 76543 21098",
    specialty: "DGO Obstetrics & Gynecology",
    shift: "afternoon",
  },
  {
    id: "doc-004",
    name: "Dr. Vikranth Mehta",
    department: "Dental",
    status: "on_leave",
    contact: "+91 65432 10987",
    specialty: "BDS Dental Surgeon",
    shift: "morning",
  },
  {
    id: "doc-005",
    name: "Dr. Ramesh Nair",
    department: "General OPD",
    status: "absent",
    contact: "+91 54321 09876",
    specialty: "MBBS Physician",
    shift: "evening",
  },
  {
    id: "doc-006",
    name: "Dr. Preeti Patel",
    department: "Pediatrics",
    status: "present",
    contact: "+91 43210 98765",
    specialty: "DCH Pediatrician",
    shift: "afternoon",
  }
];
