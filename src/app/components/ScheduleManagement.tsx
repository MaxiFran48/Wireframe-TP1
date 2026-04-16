import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Settings,
  Save,
  X,
  Plus,
  Trash2,
  AlertCircle,
  Users,
  CalendarClock,
  CalendarX,
  FileText,
  Video,
  Building2,
  CheckCircle,
  Edit,
  Layers,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface TimeSlot {
  id: string;
  start: string;
  end: string;
}

interface DaySchedule {
  enabled: boolean;
  slots: TimeSlot[];
}

interface WeekSchedule {
  [key: string]: DaySchedule;
}

interface BlockedDate {
  id: string;
  date: Date;
  reason: string;
}

interface AppointmentType {
  id: string;
  name: string;
  duration: string;
  description: string;
  confirmationType: "manual" | "automatic";
  modality: "presencial" | "virtual" | "both";
}

export default function ScheduleManagement() {
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("types");

  // Appointment Types state
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([
    {
      id: "1",
      name: "Consulta de control",
      duration: "30",
      description: "Revisión periódica del estado de salud del paciente",
      confirmationType: "automatic",
      modality: "presencial",
    },
    {
      id: "2",
      name: "Primera consulta",
      duration: "60",
      description: "Evaluación inicial completa del paciente nuevo",
      confirmationType: "manual",
      modality: "both",
    },
    {
      id: "3",
      name: "Teleconsulta",
      duration: "20",
      description: "",
      confirmationType: "automatic",
      modality: "virtual",
    },
  ]);
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<AppointmentType | null>(null);
  const [typeFormData, setTypeFormData] = useState<Omit<AppointmentType, "id">>({
    name: "",
    duration: "30",
    description: "",
    confirmationType: "automatic",
    modality: "presencial",
  });

  // Schedule state
  const [weekSchedule, setWeekSchedule] = useState<WeekSchedule>({
    lunes: { enabled: true, slots: [{ id: "1", start: "09:00", end: "17:00" }] },
    martes: { enabled: true, slots: [{ id: "2", start: "09:00", end: "17:00" }] },
    miércoles: { enabled: true, slots: [{ id: "3", start: "09:00", end: "17:00" }] },
    jueves: { enabled: true, slots: [{ id: "4", start: "09:00", end: "17:00" }] },
    viernes: { enabled: true, slots: [{ id: "5", start: "09:00", end: "17:00" }] },
    sábado: { enabled: false, slots: [{ id: "6", start: "09:00", end: "13:00" }] },
    domingo: { enabled: false, slots: [{ id: "7", start: "09:00", end: "13:00" }] },
  });

  // Blocked dates state
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([
    { id: "1", date: new Date(2026, 3, 18), reason: "Feriado - Viernes Santo" },
    { id: "2", date: new Date(2026, 4, 1), reason: "Día del Trabajador" },
  ]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [blockReason, setBlockReason] = useState("");

  // Advanced settings state
  const [slotDuration, setSlotDuration] = useState("30");
  const [minAdvanceBooking, setMinAdvanceBooking] = useState("2");
  const [maxDailyBookings, setMaxDailyBookings] = useState("20");

  const daysOfWeek = [
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
    "domingo",
  ];

  const toggleDay = (day: string) => {
    setWeekSchedule({
      ...weekSchedule,
      [day]: { ...weekSchedule[day], enabled: !weekSchedule[day].enabled },
    });
    setHasChanges(true);
  };

  const updateSlotTime = (
    day: string,
    slotId: string,
    field: "start" | "end",
    value: string
  ) => {
    const daySchedule = weekSchedule[day];
    const updatedSlots = daySchedule.slots.map((slot) =>
      slot.id === slotId ? { ...slot, [field]: value } : slot
    );
    setWeekSchedule({
      ...weekSchedule,
      [day]: { ...daySchedule, slots: updatedSlots },
    });
    setHasChanges(true);
  };

  const addSplitShift = (day: string) => {
    const daySchedule = weekSchedule[day];
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      start: "14:00",
      end: "18:00",
    };
    setWeekSchedule({
      ...weekSchedule,
      [day]: { ...daySchedule, slots: [...daySchedule.slots, newSlot] },
    });
    setHasChanges(true);
  };

  const removeSlot = (day: string, slotId: string) => {
    const daySchedule = weekSchedule[day];
    const updatedSlots = daySchedule.slots.filter((slot) => slot.id !== slotId);
    setWeekSchedule({
      ...weekSchedule,
      [day]: { ...daySchedule, slots: updatedSlots },
    });
    setHasChanges(true);
  };

  const addBlockedDates = () => {
    if (selectedDates.length === 0 || !blockReason) return;

    const newBlocked = selectedDates.map((date) => ({
      id: Date.now().toString() + Math.random(),
      date,
      reason: blockReason,
    }));

    setBlockedDates([...blockedDates, ...newBlocked]);
    setSelectedDates([]);
    setBlockReason("");
    setHasChanges(true);
  };

  const removeBlockedDate = (id: string) => {
    setBlockedDates(blockedDates.filter((d) => d.id !== id));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Save logic here
    console.log("Saving schedule...", {
      weekSchedule,
      blockedDates,
      slotDuration,
      minAdvanceBooking,
      maxDailyBookings,
    });
    setHasChanges(false);
  };

  const handleDiscard = () => {
    // Reset to initial state
    setHasChanges(false);
  };

  // Appointment Types functions
  const openTypeDialog = (type?: AppointmentType) => {
    if (type) {
      setEditingType(type);
      setTypeFormData({
        name: type.name,
        duration: type.duration,
        description: type.description,
        confirmationType: type.confirmationType,
        modality: type.modality,
      });
    } else {
      setEditingType(null);
      setTypeFormData({
        name: "",
        duration: "30",
        description: "",
        confirmationType: "automatic",
        modality: "presencial",
      });
    }
    setIsTypeDialogOpen(true);
  };

  const saveAppointmentType = () => {
    if (!typeFormData.name.trim()) return;

    if (editingType) {
      // Edit existing type
      setAppointmentTypes(
        appointmentTypes.map((t) =>
          t.id === editingType.id ? { ...typeFormData, id: t.id } : t
        )
      );
    } else {
      // Create new type
      const newType: AppointmentType = {
        ...typeFormData,
        id: Date.now().toString(),
      };
      setAppointmentTypes([...appointmentTypes, newType]);
    }

    setIsTypeDialogOpen(false);
    setHasChanges(true);
  };

  const deleteAppointmentType = (id: string) => {
    setAppointmentTypes(appointmentTypes.filter((t) => t.id !== id));
    setHasChanges(true);
  };

  const getModalityIcon = (modality: string) => {
    switch (modality) {
      case "presencial":
        return Building2;
      case "virtual":
        return Video;
      case "both":
        return Layers;
      default:
        return Building2;
    }
  };

  const getModalityLabel = (modality: string) => {
    switch (modality) {
      case "presencial":
        return "Presencial";
      case "virtual":
        return "Virtual";
      case "both":
        return "Presencial y Virtual";
      default:
        return modality;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/60 px-8 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-200/50">
                  <CalendarClock className="size-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900">
                    Gestión de Disponibilidad
                  </h1>
                  <p className="text-sm text-slate-600 mt-0.5">
                    Configure sus horarios laborales y disponibilidad para reservas
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {hasChanges && (
                <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700">
                  <AlertCircle className="size-3" />
                  Cambios sin guardar
                </Badge>
              )}
              <Button
                variant="outline"
                onClick={handleDiscard}
                disabled={!hasChanges}
                className="gap-2"
              >
                <X className="size-4" />
                Descartar
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges}
                className="gap-2 shadow-md shadow-indigo-200/50"
              >
                <Save className="size-4" />
                Guardar Cambios
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white shadow-sm border border-slate-200/60 mb-6">
            <TabsTrigger value="types" className="gap-2">
              <FileText className="size-4" />
              Tipos de Turno
            </TabsTrigger>
            <TabsTrigger value="schedule" className="gap-2">
              <Clock className="size-4" />
              Horarios Semanales
            </TabsTrigger>
            <TabsTrigger value="blocked" className="gap-2">
              <CalendarX className="size-4" />
              Días Bloqueados
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="size-4" />
              Configuración Avanzada
            </TabsTrigger>
          </TabsList>

          {/* Appointment Types Tab */}
          <TabsContent value="types" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-slate-600 text-sm">
                  Defina los diferentes tipos de turnos que ofrece a sus pacientes
                </p>
              </div>
              <Button
                onClick={() => openTypeDialog()}
                className="gap-2 shadow-md shadow-indigo-200/50"
              >
                <Plus className="size-4" />
                Crear Tipo de Turno
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {appointmentTypes.map((type) => {
                const ModalityIcon = getModalityIcon(type.modality);
                return (
                  <div
                    key={type.id}
                    className="bg-white rounded-xl shadow-md shadow-slate-200/50 border border-slate-200/60 overflow-hidden hover:shadow-lg transition-all group"
                  >
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 px-5 py-4 border-b border-slate-200/60">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 mb-1">
                            {type.name}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs bg-white/60">
                              <Clock className="size-3" />
                              {type.duration} min
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                type.confirmationType === "automatic"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              {type.confirmationType === "automatic"
                                ? "Confirmación automática"
                                : "Requiere confirmación"}
                            </Badge>
                          </div>
                        </div>
                        <div className="size-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                          <ModalityIcon className="size-5 text-indigo-600" />
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="mb-4">
                        <p className="text-xs text-slate-500 mb-1">Modalidad</p>
                        <p className="text-sm font-medium text-slate-900">
                          {getModalityLabel(type.modality)}
                        </p>
                      </div>

                      {type.description && (
                        <div className="mb-4">
                          <p className="text-xs text-slate-500 mb-1">Descripción</p>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {type.description}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openTypeDialog(type)}
                          className="flex-1 gap-2"
                        >
                          <Edit className="size-3.5" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteAppointmentType(type.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {appointmentTypes.length === 0 && (
                <div className="col-span-full bg-white rounded-xl border-2 border-dashed border-slate-200 p-12 text-center">
                  <FileText className="size-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-medium text-slate-900 mb-1">
                    No hay tipos de turno definidos
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Comience creando su primer tipo de turno para que sus pacientes
                    puedan reservar
                  </p>
                  <Button onClick={() => openTypeDialog()} className="gap-2">
                    <Plus className="size-4" />
                    Crear Primer Tipo de Turno
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Weekly Schedule Tab */}
          <TabsContent value="schedule" className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-slate-200/60">
                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                  <CalendarIcon className="size-5 text-indigo-600" />
                  Configure su horario laboral semanal
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Active los días laborables y defina los horarios de atención. Puede agregar turnos cortados para cada día.
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {daysOfWeek.map((day, index) => {
                  const schedule = weekSchedule[day];
                  return (
                    <div
                      key={day}
                      className={`px-6 py-5 transition-all ${
                        !schedule.enabled ? "bg-slate-50/50" : "hover:bg-slate-50/30"
                      }`}
                    >
                      <div className="flex items-start gap-6">
                        {/* Day Toggle */}
                        <div className="flex items-center gap-4 min-w-[180px]">
                          <Switch
                            checked={schedule.enabled}
                            onCheckedChange={() => toggleDay(day)}
                          />
                          <div>
                            <p className="font-medium text-slate-900 capitalize">
                              {day}
                            </p>
                            <p className="text-xs text-slate-500">
                              {schedule.enabled ? "Día laborable" : "Día inactivo"}
                            </p>
                          </div>
                        </div>

                        {/* Time Slots */}
                        <div className="flex-1 space-y-3">
                          {schedule.enabled && (
                            <>
                              {schedule.slots.map((slot, slotIndex) => (
                                <div
                                  key={slot.id}
                                  className="flex items-center gap-3"
                                >
                                  {schedule.slots.length > 1 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs text-slate-600"
                                    >
                                      Turno {slotIndex + 1}
                                    </Badge>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="time"
                                      value={slot.start}
                                      onChange={(e) =>
                                        updateSlotTime(day, slot.id, "start", e.target.value)
                                      }
                                      className="w-[130px]"
                                    />
                                    <span className="text-slate-400">—</span>
                                    <Input
                                      type="time"
                                      value={slot.end}
                                      onChange={(e) =>
                                        updateSlotTime(day, slot.id, "end", e.target.value)
                                      }
                                      className="w-[130px]"
                                    />
                                  </div>
                                  {schedule.slots.length > 1 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeSlot(day, slot.id)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="size-4" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addSplitShift(day)}
                                className="gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                              >
                                <Plus className="size-4" />
                                Agregar turno cortado
                              </Button>
                            </>
                          )}
                          {!schedule.enabled && (
                            <p className="text-sm text-slate-400 italic">
                              Día deshabilitado para reservas
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Blocked Dates Tab */}
          <TabsContent value="blocked" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Add Blocked Dates */}
              <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-slate-200/60">
                  <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                    <CalendarX className="size-5 text-red-600" />
                    Bloquear fechas
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Seleccione las fechas que desea inhabilitar para reservas
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-center">
                    <Calendar
                      mode="multiple"
                      selected={selectedDates}
                      onSelect={(dates) => setSelectedDates(dates || [])}
                      className="rounded-md border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Motivo del bloqueo
                    </label>
                    <Input
                      placeholder="Ej: Vacaciones, Licencia médica, Feriado..."
                      value={blockReason}
                      onChange={(e) => setBlockReason(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={addBlockedDates}
                    disabled={selectedDates.length === 0 || !blockReason}
                    className="w-full gap-2"
                  >
                    <Plus className="size-4" />
                    Bloquear {selectedDates.length > 0 && `(${selectedDates.length})`} fecha
                    {selectedDates.length !== 1 && "s"}
                  </Button>
                </div>
              </div>

              {/* Blocked Dates List */}
              <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200/60">
                  <h2 className="font-semibold text-slate-900">
                    Fechas bloqueadas ({blockedDates.length})
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Listado de días inhabilitados para reservas
                  </p>
                </div>
                <div className="max-h-[500px] overflow-y-auto">
                  {blockedDates.length === 0 ? (
                    <div className="p-12 text-center">
                      <CalendarX className="size-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm">
                        No hay fechas bloqueadas actualmente
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {blockedDates
                        .sort((a, b) => a.date.getTime() - b.date.getTime())
                        .map((blocked) => (
                          <div
                            key={blocked.id}
                            className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="size-10 rounded-lg bg-red-100 flex items-center justify-center">
                                <CalendarIcon className="size-5 text-red-600" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">
                                  {blocked.date.toLocaleDateString("es-AR", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                                <p className="text-sm text-slate-600">{blocked.reason}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBlockedDate(blocked.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Advanced Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-slate-200/60">
                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Settings className="size-5 text-purple-600" />
                  Configuración avanzada
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Defina parámetros adicionales para optimizar la gestión de turnos
                </p>
              </div>

              <div className="p-8 space-y-8">
                {/* Slot Duration */}
                <div className="flex items-start gap-6 pb-8 border-b border-slate-100">
                  <div className="size-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                    <Clock className="size-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block font-medium text-slate-900 mb-1">
                      Duración de cada turno
                    </label>
                    <p className="text-sm text-slate-600 mb-4">
                      Defina cuánto tiempo dura cada cita. Este valor determina los intervalos disponibles para reservar.
                    </p>
                    <div className="flex items-center gap-4">
                      <Select value={slotDuration} onValueChange={(val) => {
                        setSlotDuration(val);
                        setHasChanges(true);
                      }}>
                        <SelectTrigger className="w-[240px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutos</SelectItem>
                          <SelectItem value="20">20 minutos</SelectItem>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="45">45 minutos</SelectItem>
                          <SelectItem value="60">60 minutos (1 hora)</SelectItem>
                          <SelectItem value="90">90 minutos (1.5 horas)</SelectItem>
                          <SelectItem value="120">120 minutos (2 horas)</SelectItem>
                        </SelectContent>
                      </Select>
                      <Badge variant="outline" className="text-slate-600">
                        Actual: {slotDuration} min
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Minimum Advance Booking */}
                <div className="flex items-start gap-6 pb-8 border-b border-slate-100">
                  <div className="size-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <CalendarClock className="size-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block font-medium text-slate-900 mb-1">
                      Antelación mínima de reserva
                    </label>
                    <p className="text-sm text-slate-600 mb-4">
                      Tiempo mínimo requerido antes de una cita para que los pacientes puedan reservarla.
                    </p>
                    <div className="flex items-center gap-4">
                      <Select value={minAdvanceBooking} onValueChange={(val) => {
                        setMinAdvanceBooking(val);
                        setHasChanges(true);
                      }}>
                        <SelectTrigger className="w-[240px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Sin antelación mínima</SelectItem>
                          <SelectItem value="1">1 hora antes</SelectItem>
                          <SelectItem value="2">2 horas antes</SelectItem>
                          <SelectItem value="4">4 horas antes</SelectItem>
                          <SelectItem value="24">24 horas antes (1 día)</SelectItem>
                          <SelectItem value="48">48 horas antes (2 días)</SelectItem>
                          <SelectItem value="72">72 horas antes (3 días)</SelectItem>
                        </SelectContent>
                      </Select>
                      <Badge variant="outline" className="text-slate-600">
                        {minAdvanceBooking === "0" ? "Inmediato" : `${minAdvanceBooking}h antes`}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Max Daily Bookings */}
                <div className="flex items-start gap-6">
                  <div className="size-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <Users className="size-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block font-medium text-slate-900 mb-1">
                      Límite máximo de reservas por día
                    </label>
                    <p className="text-sm text-slate-600 mb-4">
                      Número máximo de turnos que se pueden reservar por día. Una vez alcanzado, el sistema cerrará la disponibilidad automáticamente.
                    </p>
                    <div className="flex items-center gap-4">
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={maxDailyBookings}
                        onChange={(e) => {
                          setMaxDailyBookings(e.target.value);
                          setHasChanges(true);
                        }}
                        className="w-[240px]"
                      />
                      <Badge variant="outline" className="text-slate-600">
                        Máximo: {maxDailyBookings} turnos/día
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200/60 rounded-xl p-5">
              <div className="flex gap-4">
                <AlertCircle className="size-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    Sobre la configuración avanzada
                  </p>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Estos parámetros afectan directamente a la experiencia de reserva de sus pacientes.
                    Asegúrese de configurar valores que se ajusten a su práctica profesional y le permitan
                    brindar un servicio de calidad sin comprometer su agenda.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Appointment Type Dialog */}
      <Dialog open={isTypeDialogOpen} onOpenChange={setIsTypeDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingType ? "Editar Tipo de Turno" : "Crear Nuevo Tipo de Turno"}
            </DialogTitle>
            <DialogDescription>
              Configure los detalles del tipo de turno que sus pacientes podrán reservar
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4 max-h-[70vh] overflow-y-auto pr-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nombre del tipo de turno <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Ej: Consulta de control, Primera consulta..."
                value={typeFormData.name}
                onChange={(e) =>
                  setTypeFormData({ ...typeFormData, name: e.target.value })
                }
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Duración <span className="text-red-500">*</span>
              </label>
              <Select
                value={typeFormData.duration}
                onValueChange={(val) =>
                  setTypeFormData({ ...typeFormData, duration: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="20">20 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="45">45 minutos</SelectItem>
                  <SelectItem value="60">60 minutos (1 hora)</SelectItem>
                  <SelectItem value="90">90 minutos (1.5 horas)</SelectItem>
                  <SelectItem value="120">120 minutos (2 horas)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Descripción (opcional)
              </label>
              <Textarea
                placeholder="Describa brevemente en qué consiste este tipo de turno..."
                value={typeFormData.description}
                onChange={(e) =>
                  setTypeFormData({ ...typeFormData, description: e.target.value })
                }
                className="min-h-20"
              />
            </div>

            {/* Confirmation Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Tipo de confirmación <span className="text-red-500">*</span>
              </label>
              <RadioGroup
                value={typeFormData.confirmationType}
                onValueChange={(val: "manual" | "automatic") =>
                  setTypeFormData({ ...typeFormData, confirmationType: val })
                }
              >
                <div className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                  <RadioGroupItem value="automatic" id="automatic" />
                  <div className="flex-1">
                    <label
                      htmlFor="automatic"
                      className="font-medium text-slate-900 cursor-pointer flex items-center gap-2"
                    >
                      <CheckCircle className="size-4 text-emerald-600" />
                      Confirmación automática
                    </label>
                    <p className="text-sm text-slate-600 mt-1">
                      El turno se confirma instantáneamente cuando el paciente reserva
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                  <RadioGroupItem value="manual" id="manual" />
                  <div className="flex-1">
                    <label
                      htmlFor="manual"
                      className="font-medium text-slate-900 cursor-pointer flex items-center gap-2"
                    >
                      <AlertCircle className="size-4 text-amber-600" />
                      Requiere confirmación manual
                    </label>
                    <p className="text-sm text-slate-600 mt-1">
                      Usted debe revisar y confirmar manualmente cada reserva
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Modality */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Modalidad <span className="text-red-500">*</span>
              </label>
              <RadioGroup
                value={typeFormData.modality}
                onValueChange={(val: "presencial" | "virtual" | "both") =>
                  setTypeFormData({ ...typeFormData, modality: val })
                }
              >
                <div className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                  <RadioGroupItem value="presencial" id="presencial" />
                  <div className="flex-1">
                    <label
                      htmlFor="presencial"
                      className="font-medium text-slate-900 cursor-pointer flex items-center gap-2"
                    >
                      <Building2 className="size-4 text-blue-600" />
                      Presencial
                    </label>
                    <p className="text-sm text-slate-600 mt-1">
                      La consulta se realiza en el consultorio físico
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                  <RadioGroupItem value="virtual" id="virtual" />
                  <div className="flex-1">
                    <label
                      htmlFor="virtual"
                      className="font-medium text-slate-900 cursor-pointer flex items-center gap-2"
                    >
                      <Video className="size-4 text-purple-600" />
                      Virtual
                    </label>
                    <p className="text-sm text-slate-600 mt-1">
                      La consulta se realiza por videollamada
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                  <RadioGroupItem value="both" id="both" />
                  <div className="flex-1">
                    <label
                      htmlFor="both"
                      className="font-medium text-slate-900 cursor-pointer flex items-center gap-2"
                    >
                      <Layers className="size-4 text-indigo-600" />
                      Presencial y Virtual
                    </label>
                    <p className="text-sm text-slate-600 mt-1">
                      El paciente puede elegir entre consulta presencial o virtual
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTypeDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={saveAppointmentType}
              disabled={!typeFormData.name.trim()}
              className="gap-2"
            >
              <Save className="size-4" />
              {editingType ? "Guardar Cambios" : "Crear Tipo de Turno"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
