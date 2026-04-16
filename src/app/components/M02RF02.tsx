import { useState, useEffect } from "react";
import {
  CalendarX,
  Plus,
  Trash2,
  AlertCircle,
  Save,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Calendar } from "./ui/calendar";
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

interface BlockedDate {
  id: string;
  date: Date;
  reason: string;
}

interface Props {
  onDiscard?: () => void;
  onSave?: () => void;
  onNavigateHome?: () => void;
}

export default function M02RF02({ onDiscard, onSave, onNavigateHome }: Props) {
  const [hasChanges, setHasChanges] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [showNavigateDialog, setShowNavigateDialog] = useState(false);

  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([
    { id: "1", date: new Date(2026, 3, 18), reason: "Feriado - Viernes Santo" },
    { id: "2", date: new Date(2026, 4, 1), reason: "Día del Trabajador" },
  ]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [blockReason, setBlockReason] = useState("");

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
              <div className="size-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <CalendarX className="size-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                  M02-RF02: Días Bloqueados
                </h1>
                <p className="text-sm text-slate-600">
                  Determine qué fechas no estarán disponibles para la reserva de turnos.
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl shadow-inner">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Plus className="size-4 text-slate-500" /> Añadir Fechas de Bloqueo
                </h3>
                
                <div className="flex justify-center mb-6 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                  <Calendar
                    mode="multiple"
                    selected={selectedDates}
                    onSelect={(dates) => { setSelectedDates(dates as Date[]); setHasChanges(true); }}
                    className="rounded-md"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Motivo / Descripción
                    </label>
                    <Input
                      placeholder="Ej: Feriado Nacional, Vacaciones, Mantenimiento..."
                      value={blockReason}
                      onChange={(e) => setBlockReason(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    onClick={addBlockedDates} 
                    disabled={selectedDates.length === 0 || !blockReason}
                    className="w-full gap-2 shadow-sm shadow-indigo-200/50 bg-indigo-600 hover:bg-indigo-700 text-white transition-all font-medium"
                  >
                    <CalendarX className="size-4" />
                    Bloquear {selectedDates.length > 0 ? `${selectedDates.length} día(s)` : "Días"}
                  </Button>
                </div>

                {selectedDates.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex gap-3 text-sm text-blue-800">
                    <AlertCircle className="size-4 shrink-0 text-blue-500 mt-0.5" />
                    <p>
                      Ha seleccionado <strong>{selectedDates.length}</strong> fecha(s) del calendario para bloquear.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CalendarX className="size-4 text-slate-500" /> Fechas Bloqueadas
                </h3>
                
                <div className="space-y-3">
                  {blockedDates.length === 0 ? (
                    <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                      <CalendarX className="size-8 mx-auto text-slate-300 mb-3" />
                      <p className="text-slate-500 text-sm">No hay fechas bloqueadas actualmente</p>
                    </div>
                  ) : (
                    blockedDates.sort((a, b) => a.date.getTime() - b.date.getTime()).map((blocked) => (
                      <div 
                        key={blocked.id}
                        className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm group hover:border-red-200 hover:shadow-md transition-all"
                      >
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-900">
                              {blocked.date.toLocaleDateString('es-ES', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => removeBlockedDate(blocked.id)}
                              className="text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all -my-2 -mr-2"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                          <span className="text-sm text-slate-500 flex items-center gap-1.5">
                            <div className="size-1.5 rounded-full bg-red-400"></div>
                            {blocked.reason}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
