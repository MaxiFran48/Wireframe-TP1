import { useState } from "react";
import { ArrowLeft, Calendar, MapPin, User, AlertCircle, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface AppointmentData {
  doctorName: string;
  specialty: string;
  appointmentType: string;
  date: string;
  time: string;
  location: string;
  room: string;
  initials: string;
}

export default function CancelAppointment() {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [isConfirming, setIsConfirming] = useState(false);

  // Mock appointment data
  const appointment: AppointmentData = {
    doctorName: "Dra. Valentina Rossi",
    specialty: "Cardiología",
    appointmentType: "Consulta de control",
    date: "Jueves 26 de Octubre",
    time: "10:30 AM",
    location: "Clínica Central",
    room: "Consultorio 302",
    initials: "VR",
  };

  const handleCancel = () => {
    setIsConfirming(true);
    // Add your cancellation logic here
    setTimeout(() => {
      setIsConfirming(false);
      alert("Turno cancelado exitosamente");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/60 px-4 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <button
          className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors group"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="size-5 group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-medium">Cancelar Cita</span>
        </button>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          {/* Settings icon placeholder */}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 max-w-md mx-auto w-full">
        {/* Context Text */}
        <div className="mb-6 animate-fade-in opacity-0 [animation-delay:100ms]">
          <p className="text-slate-600 text-[15px] leading-relaxed">
            Estás a punto de cancelar el turno con el siguiente profesional. Esta
            acción <span className="font-medium text-slate-800">no se puede deshacer</span>.
          </p>
        </div>

        {/* Appointment Card */}
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 overflow-hidden mb-6 animate-fade-in opacity-0 [animation-delay:200ms]">
          {/* Doctor Header */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 border-b border-slate-200/60">
            <div className="flex items-start gap-4">
              <div className="size-14 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg shadow-md shrink-0">
                {appointment.initials}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-slate-900 text-lg mb-0.5">
                  {appointment.doctorName}
                </h2>
                <p className="text-indigo-700 text-sm font-medium mb-1">
                  {appointment.specialty}
                </p>
                <div className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  <div className="size-1.5 rounded-full bg-indigo-500"></div>
                  <span className="text-xs font-medium text-slate-700">
                    {appointment.appointmentType}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-3 group">
              <div className="size-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                <Calendar className="size-4 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-500 mb-0.5">Fecha y hora</p>
                <p className="font-medium text-slate-900">
                  {appointment.date}, {appointment.time}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 group">
              <div className="size-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                <MapPin className="size-4 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-500 mb-0.5">Ubicación</p>
                <p className="font-medium text-slate-900">
                  {appointment.location}, {appointment.room}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cancellation Reason */}
        <div className="mb-6 animate-fade-in opacity-0 [animation-delay:300ms]">
          <label className="block text-slate-700 font-medium mb-3">
            ¿Por qué necesitas cancelar?
          </label>
          <Select value={selectedReason} onValueChange={setSelectedReason}>
            <SelectTrigger className="w-full h-12 bg-white border-slate-300 hover:border-slate-400 transition-colors shadow-sm">
              <SelectValue placeholder="Selecciona un motivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="schedule_conflict">
                Conflicto de horario
              </SelectItem>
              <SelectItem value="feeling_better">Ya me siento mejor</SelectItem>
              <SelectItem value="rescheduling">Necesito reprogramar</SelectItem>
              <SelectItem value="financial">Motivos económicos</SelectItem>
              <SelectItem value="transportation">Problemas de transporte</SelectItem>
              <SelectItem value="other">Otro motivo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Warning Notice */}
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 mb-6 animate-fade-in opacity-0 [animation-delay:400ms]">
          <div className="flex gap-3">
            <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-900 font-medium mb-1">
                Nota Importante
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">
                Las cancelaciones con menos de 24 horas de anticipación pueden
                tener recargos según las políticas de la clínica.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 animate-fade-in opacity-0 [animation-delay:500ms]">
          <Button
            variant="destructive"
            size="lg"
            className="w-full h-12 font-semibold text-[15px] shadow-lg shadow-red-200/50 hover:shadow-red-300/50 transition-all"
            onClick={handleCancel}
            disabled={isConfirming}
          >
            {isConfirming ? (
              <span className="flex items-center gap-2">
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Cancelando...
              </span>
            ) : (
              "Confirmar Cancelación"
            )}
          </Button>

          <button
            className="w-full text-center text-slate-600 hover:text-slate-900 font-medium text-sm py-2 transition-colors"
            onClick={() => window.history.back()}
          >
            Volver, mantener turno
          </button>
        </div>
      </main>

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
