import { useState, useEffect } from "react";
import {
  Settings,
  Save,
  X,
  AlertCircle,
  Clock,
  Users,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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

interface Props {
  onDiscard?: () => void;
  onSave?: () => void;
  onNavigateHome?: () => void;
}

export default function M02RF03({ onDiscard, onSave, onNavigateHome }: Props) {
  const [hasChanges, setHasChanges] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [showNavigateDialog, setShowNavigateDialog] = useState(false);

  const [slotDuration, setSlotDuration] = useState("30");
  const [minAdvanceBooking, setMinAdvanceBooking] = useState("2");
  const [maxDailyBookings, setMaxDailyBookings] = useState("20");

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

  const handleSave = () => {
    setHasChanges(false);
    toast.success("Los cambios han sido guardados correctamente.", { position: "top-right" });
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
              <div className="size-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                <Settings className="size-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                  M02-RF03: Preferencias
                </h1>
                <p className="text-sm text-slate-600">
                  Ajuste los tiempos y topes para optimizar su tiempo o agenda.
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
                <Button variant="outline" onClick={attemptDiscard} disabled={!hasChanges} className="gap-2">
                  <X className="size-4" />
                  Descartar
                </Button>
                <Button onClick={handleSave} disabled={!hasChanges} className="gap-2 shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Save className="size-4" />
                  Guardar
                </Button>
            </div>
          </div>

          <div className="space-y-8 bg-slate-50 border border-slate-200 p-8 rounded-xl shadow-inner">
            <div className="flex items-start gap-6 bg-white p-6 rounded-lg border border-slate-200/60 shadow-sm transition-all hover:border-blue-200">
              <div className="size-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <Clock className="size-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <label className="block font-medium text-slate-900 mb-1">
                  Intervalo de descanso (minutos)
                </label>
                <p className="text-sm text-slate-600 mb-4">
                  Tiempo que el sistema agregará automáticamente entre el final de un turno y el inicio del siguiente (Para descansar, limpiar, reestructurar).
                </p>
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <Input
                    type="number"
                    min="0"
                    max="120"
                    step="5"
                    value={slotDuration}
                    onChange={(e) => {
                      setSlotDuration(e.target.value);
                      setHasChanges(true);
                    }}
                    className="w-[200px]"
                  />
                  <Badge variant="outline" className="text-slate-600">
                    {slotDuration} minutos
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6 bg-white p-6 rounded-lg border border-slate-200/60 shadow-sm transition-all hover:border-purple-200">
              <div className="size-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                <AlertCircle className="size-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <label className="block font-medium text-slate-900 mb-1">
                  Antelación mínima de reserva (horas)
                </label>
                <p className="text-sm text-slate-600 mb-4">
                  Define cuánto tiempo antes de la hora del turno un paciente puede realizar una reserva. Impide reservas de "último minuto".
                </p>
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <Input
                    type="number"
                    min="0"
                    max="72"
                    value={minAdvanceBooking}
                    onChange={(e) => {
                      setMinAdvanceBooking(e.target.value);
                      setHasChanges(true);
                    }}
                    className="w-[200px]"
                  />
                  <Badge variant="outline" className="text-slate-600">
                    Mínimo {minAdvanceBooking} {minAdvanceBooking === "1" ? "hora" : "horas"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6 bg-white p-6 rounded-lg border border-slate-200/60 shadow-sm transition-all hover:border-emerald-200">
              <div className="size-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <Users className="size-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <label className="block font-medium text-slate-900 mb-1">
                  Límite máximo de reservas por día
                </label>
                <p className="text-sm text-slate-600 mb-4">
                  Número máximo de turnos que el sistema le confirmará en un único día. Una vez alcanzado se cerrará el enlace público para esa fecha.
                </p>
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={maxDailyBookings}
                    onChange={(e) => {
                      setMaxDailyBookings(e.target.value);
                      setHasChanges(true);
                    }}
                    className="w-[200px]"
                  />
                  <Badge variant="outline" className="text-slate-600">
                    Tope: {maxDailyBookings} turnos/día
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-indigo-50 border border-indigo-200/60 rounded-xl p-5">
            <div className="flex gap-4">
              <AlertCircle className="size-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-indigo-900 mb-1">
                  Información de Preferencias
                </p>
                <p className="text-sm text-indigo-800/80 leading-relaxed">
                  Estos parámetros afectan directamente cómo los pacientes visualizan el sistema. La pre-configuración actual optimiza su agenda reduciendo turnos solapados y exigencias no planificadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
