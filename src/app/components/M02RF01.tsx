import { useState, useEffect } from "react";
import {
  Clock,
  Save,
  X,
  Plus,
  Trash2,
  AlertCircle,
  CalendarClock,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

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

interface Props {
  onDiscard?: () => void;
  onSave?: () => void;
  onNavigateHome?: () => void;
}

export default function M02RF01({ onDiscard, onSave, onNavigateHome }: Props) {
  const [hasChanges, setHasChanges] = useState(false);
  const [showNavigateDialog, setShowNavigateDialog] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

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

  const daysOfWeek = [
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
    "domingo",
  ];

  // Intercept beforeunload if unsaved changes exist
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

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

  const handleSave = () => {
    setHasChanges(false);
    toast.success("Los cambios han sido guardados correctamente.", {
      position: "top-right"
    });
    if (onSave) onSave();
  };

  const attemptDiscard = () => {
    if (hasChanges) {
      setShowDiscardDialog(true);
    } else if (onDiscard) {
      onDiscard();
    }
  };

  const confirmDiscard = () => {
    setShowDiscardDialog(false);
    setHasChanges(false);
    
    // Check if we are discarding because we want to leave the page or just clear
    if (showNavigateDialog) {
      toast.info("Saliendo sin guardar cambios.", { position: "top-right" });
      if (onNavigateHome) onNavigateHome();
      return;
    }
    
    toast.info("Cambios descartados exitosamente.", { position: "top-right" });
    if (onDiscard) onDiscard();
  };

  const attemptNavigate = () => {
    if (hasChanges) {
      setShowNavigateDialog(true);
      setShowDiscardDialog(true);
    } else if (onNavigateHome) {
      onNavigateHome();
    }
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Navigation Bar */}
      <div className="p-4 border-b bg-white shadow-sm z-10">
        <button 
          onClick={attemptNavigate}
          className="text-sm font-medium text-slate-600 hover:text-indigo-600 flex items-center gap-2 transition-colors"
        >
          ← Volver al inicio (Perfil de Administrador)
        </button>
      </div>

      <div className="min-h-screen bg-slate-50 flex flex-col p-8 items-center">
        <AlertDialog open={showDiscardDialog} onOpenChange={(open) => {
          setShowDiscardDialog(open);
          if (!open) setShowNavigateDialog(false);
        }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Está seguro que desea descartar los cambios?</AlertDialogTitle>
              <AlertDialogDescription>
                Tiene modificaciones sin guardar. Si {showNavigateDialog ? 'sale' : 'descarta los cambios'}, perderá todo lo que haya ajustado recientemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowNavigateDialog(false)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDiscard} className="bg-red-600 hover:bg-red-700 text-white">
                Sí, {showNavigateDialog ? 'salir sin guardar' : 'descartar'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      <div className="w-full max-w-4xl bg-white p-6 shadow-sm border border-slate-200 rounded-xl">
        <div className="flex items-center justify-between mb-8 border-b pb-6">
          <div className="flex gap-4 items-center">
            <div className="size-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shrink-0">
              <CalendarClock className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                M02-RF01: Agenda de Horarios
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                Configure sus horas laborales por día para estar disponible a reservas.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {hasChanges && (
              <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700">
                <AlertCircle className="size-3 mr-1" />
                Cambios sin guardar
              </Badge>
            )}
            <Button
              variant="outline"
              onClick={attemptDiscard}
              disabled={!hasChanges}
              className="gap-2"
            >
              <X className="size-4" />
              Descartar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              className="gap-2 shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Save className="size-4" />
              Guardar Cambios
            </Button>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl shadow-inner border border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-slate-200/60">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Clock className="size-5 text-indigo-600" />
              Configure su horario laboral semanal
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Active los días laborables y defina los horarios de atención. Puede agregar turnos cortados para cada día.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {daysOfWeek.map((day) => {
              const schedule = weekSchedule[day];
              return (
                <div
                  key={day}
                  className={`px-6 py-5 transition-all ${
                    !schedule.enabled ? "bg-white" : "bg-slate-50/10 hover:bg-slate-50/40"
                  }`}
                >
                  <div className="flex items-start gap-6">
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
                            className="gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50 mt-1"
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
      </div>
    </div>
    </div>
  );
}