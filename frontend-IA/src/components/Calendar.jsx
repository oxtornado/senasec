import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Calendar = ({ loans = [], onDateSelect }) => {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Obtener el primer día del mes actual
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  // Obtener el último día del mes actual
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );

  // Obtener el día de la semana del primer día del mes (0 = Domingo, 1 = Lunes, etc.)
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // Nombres de los días de la semana
  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  // Nombres de los meses
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // Función para cambiar al mes anterior
  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  // Función para cambiar al mes siguiente
  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  // Función para manejar la selección de una fecha
  const handleDateClick = (day) => {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    setSelectedDate(selectedDate);
    if (onDateSelect) {
      onDateSelect(selectedDate);
    }
  };

  // Verificar si una fecha tiene préstamos
  const hasLoans = (day) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    return loans.some((loan) => {
      const loanDate = new Date(loan.start_time);
      return (
        loanDate.getDate() === date.getDate() &&
        loanDate.getMonth() === date.getMonth() &&
        loanDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Generar los días del calendario
  const generateCalendarDays = () => {
    const days = [];

    // Agregar días vacíos para alinear con el día de la semana correcto
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    // Agregar los días del mes
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === currentDate.getMonth() &&
        new Date().getFullYear() === currentDate.getFullYear();

      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();

      const hasLoan = hasLoans(day);

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-10 w-10 flex items-center justify-center rounded-full cursor-pointer
                     ${
                       isToday
                         ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                         : ""
                     }
                     ${
                       isSelected
                         ? "bg-blue-500 text-white dark:bg-blue-700"
                         : ""
                     }
                     ${
                       hasLoan
                         ? "border-2 border-green-500 dark:border-green-400"
                         : ""
                     }
                     ${
                       !isToday && !isSelected
                         ? "hover:bg-gray-100 dark:hover:bg-gray-700"
                         : ""
                     }`}
        >
          {day}
        </div>,
      );
    }

    return days;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{generateCalendarDays()}</div>

      <div className="mt-4 flex items-center">
        <div className="w-4 h-4 border-2 border-green-500 dark:border-green-400 rounded-full mr-2"></div>
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {t("hasLoans")}
        </span>
      </div>
    </div>
  );
};

export default Calendar;
