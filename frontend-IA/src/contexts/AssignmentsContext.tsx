import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos para las asignaciones
export interface Assignment {
  id: number;
  instructorName: string;
  ficha: string;
  status: 'Activo' | 'Inactivo';
  assignmentDates: string;
  schedule: string;
  classroom: string;
  createdAt: string;
}

// Tipos para programaciones (vista en Loans/Programaciones)
export interface Schedule {
  id: number;
  instructorName: string;
  ficha: string;
  schedule: string;
  classroom: string;
  status: 'Activo' | 'Inactivo';
  type: 'instructor' | 'aseo';
  assignmentDates: string;
}

interface AssignmentsContextType {
  assignments: Assignment[];
  schedules: Schedule[];
  addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  updateAssignment: (id: number, assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  deleteAssignment: (id: number) => void;
  validateScheduleConflict: (schedule: string, classroom: string, excludeId?: number) => boolean;
  isCleaningTime: (schedule: string) => boolean;
  availableTimes: string[];
  isValidTimeSlot: (time: string) => boolean;
  isCleaningTimeSlot: (schedule: string) => boolean;
}

const AssignmentsContext = createContext<AssignmentsContextType | undefined>(undefined);

// Datos exactos según especificaciones: solo 3 instructores con jornadas completas
const initialAssignments: Assignment[] = [
  {
    id: 1,
    instructorName: 'Jorge Orlando Castro',
    ficha: '2877795',
    status: 'Activo',
    assignmentDates: 'Lunes a Viernes',
    schedule: '07:00 - 13:00',
    classroom: 'Aula de Sistemas 1',
    createdAt: '2024-08-05'
  },
  {
    id: 2,
    instructorName: 'Esteban Hernández',
    ficha: '2877795',
    status: 'Activo',
    assignmentDates: 'Lunes a Viernes',
    schedule: '13:30 - 18:00',
    classroom: 'Aula de Sistemas 2',
    createdAt: '2024-08-02'
  },
  {
    id: 3,
    instructorName: 'Martín Castro',
    ficha: '2877795',
    status: 'Activo',
    assignmentDates: 'Lunes a Viernes',
    schedule: '18:30 - 22:00',
    classroom: 'Aula de Sistemas 3',
    createdAt: '2024-08-03'
  }
];

export const AssignmentsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    const savedAssignments = localStorage.getItem('senasec_assignments');
    if (savedAssignments) {
      setAssignments(JSON.parse(savedAssignments));
    } else {
      setAssignments(initialAssignments);
    }
  }, []);

  // Guardar en localStorage cuando cambien las asignaciones
  useEffect(() => {
    if (assignments.length > 0) {
      localStorage.setItem('senasec_assignments', JSON.stringify(assignments));
    }
  }, [assignments]);

  // Horarios válidos según los nuevos requerimientos
  const AVAILABLE_TIMES = [
    // Jornada mañana: 07:00 a 13:00
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00',
    // 13:00-13:30 reservado para ASEO (no asignable)
    // Jornada tarde: 13:30 a 18:00
    '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00',
    // Jornada noche: 18:30 a 22:00
    '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
  ];

  // Función para verificar si es horario de aseo (13:00-13:30)
  const isCleaningTime = (time: string): boolean => {
    return time === '13:00';
  };

  // Función para verificar si un horario está en las jornadas válidas
  const isValidTimeSlot = (time: string): boolean => {
    const hour = parseInt(time.split(':')[0]);
    const minute = parseInt(time.split(':')[1]);
    const totalMinutes = hour * 60 + minute;
    
    // Jornada mañana: 07:00-13:00 (420-780 minutos)
    const morningStart = 7 * 60; // 420
    const morningEnd = 13 * 60; // 780
    
    // Jornada tarde: 13:30-18:00 (810-1080 minutos)
    const afternoonStart = 13 * 60 + 30; // 810
    const afternoonEnd = 18 * 60; // 1080
    
    // Jornada noche: 18:30-22:00 (1110-1320 minutos)
    const nightStart = 18 * 60 + 30; // 1110
    const nightEnd = 22 * 60; // 1320
    
    return (
      (totalMinutes >= morningStart && totalMinutes <= morningEnd) ||
      (totalMinutes >= afternoonStart && totalMinutes <= afternoonEnd) ||
      (totalMinutes >= nightStart && totalMinutes <= nightEnd)
    );
  };

  // Función para verificar si un horario incluye el tiempo de aseo (13:00-13:30)
  const isCleaningTimeSlot = (schedule: string): boolean => {
    const [startTime, endTime] = schedule.split(' - ');
    const start = parseTime(startTime);
    const end = parseTime(endTime);
    const cleaningStart = parseTime('13:00');
    const cleaningEnd = parseTime('13:30');
    
    // Verificar si el horario se superpone con el tiempo de aseo
    return (start < cleaningEnd && end > cleaningStart);
  };

  // Función auxiliar para convertir tiempo a minutos
  const parseTime = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Función para validar conflictos de horario
  const validateScheduleConflict = (schedule: string, classroom: string, excludeId?: number): boolean => {
    // Solo aplicar restricciones a aulas de sistemas
    if (!classroom.toLowerCase().includes('sistemas')) {
      return false;
    }

    // Verificar si incluye tiempo de aseo
    if (isCleaningTimeSlot(schedule)) {
      return true;
    }

    // Verificar conflictos con otras asignaciones activas
    const conflictingAssignment = assignments.find(assignment => 
      assignment.id !== excludeId &&
      assignment.classroom === classroom &&
      assignment.status === 'Activo' &&
      assignment.schedule === schedule
    );

    return !!conflictingAssignment;
  };

  // Generar horarios de programación incluyendo aseo
  const generateSchedules = (): Schedule[] => {
    const schedules: Schedule[] = [];

    // Agregar asignaciones de instructores activos
    assignments
      .filter(assignment => assignment.status === 'Activo')
      .forEach(assignment => {
        schedules.push({
          id: assignment.id,
          instructorName: assignment.instructorName,
          ficha: assignment.ficha,
          schedule: assignment.schedule,
          classroom: assignment.classroom,
          status: assignment.status,
          type: 'instructor',
          assignmentDates: assignment.assignmentDates
        });
      });

    // Agregar horarios de aseo para aulas de sistemas
    const systemsClassrooms = ['Aula de Sistemas 1', 'Aula de Sistemas 2', 'Aula de Sistemas 3'];
    systemsClassrooms.forEach((classroom, index) => {
      schedules.push({
        id: 1000 + index, // IDs únicos para aseo
        instructorName: 'Aseo - Colaborador de turno',
        ficha: 'ASEO',
        schedule: '13:00 - 13:30',
        classroom: classroom,
        status: 'Activo',
        type: 'aseo',
        assignmentDates: 'Lunes a Viernes'
      });
    });

    return schedules.sort((a, b) => {
      // Ordenar por aula y luego por horario
      if (a.classroom !== b.classroom) {
        return a.classroom.localeCompare(b.classroom);
      }
      return parseTime(a.schedule.split(' - ')[0]) - parseTime(b.schedule.split(' - ')[0]);
    });
  };

  const addAssignment = (assignmentData: Omit<Assignment, 'id' | 'createdAt'>) => {
    const newId = Math.max(...assignments.map(a => a.id), 0) + 1;
    const newAssignment: Assignment = {
      ...assignmentData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAssignments(prev => [...prev, newAssignment]);
  };

  const updateAssignment = (id: number, assignmentData: Omit<Assignment, 'id' | 'createdAt'>) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === id 
        ? { ...assignment, ...assignmentData }
        : assignment
    ));
  };

  const deleteAssignment = (id: number) => {
    setAssignments(prev => prev.filter(assignment => assignment.id !== id));
  };

  const value: AssignmentsContextType = {
    assignments,
    schedules: generateSchedules(),
    addAssignment,
    updateAssignment,
    deleteAssignment,
    validateScheduleConflict,
    isCleaningTime,
    availableTimes: AVAILABLE_TIMES,
    isValidTimeSlot,
    isCleaningTimeSlot
  };

  return (
    <AssignmentsContext.Provider value={value}>
      {children}
    </AssignmentsContext.Provider>
  );
};

export const useAssignments = (): AssignmentsContextType => {
  const context = useContext(AssignmentsContext);
  if (!context) {
    throw new Error('useAssignments must be used within an AssignmentsProvider');
  }
  return context;
};
