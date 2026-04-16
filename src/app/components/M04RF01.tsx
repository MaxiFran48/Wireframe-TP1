import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  CheckCircle2,
  ChevronLeft,
  CalendarDays,
  AlertCircle,
  BriefcaseMedical
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Calendar } from "./ui/calendar";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { ScrollArea } from "./ui/scroll-area";

interface Props {
  onNavigateHome?: () => void;
}

const MOCKED_TIMES = [
  "09:00", "09:30", "10:00", "10:30", "11:00",
  "14:00", "14:30", "15:00", "15:30", "16:00"
];

const MOCKED_SERVICES = [
  "Consulta General",
  "Estudio Crónico",
  "Estudio de Rutina",
  "Seguimiento",
];

export default function M04RF01({ onNavigateHome }: Props) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [service, setService] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (name.trim().length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Ingrese un correo electrónico válido.";
    }
    if (!/^\d{8,15}$/.test(phone)) {
      newErrors.phone = "El teléfono debe contener entre 8 y 15 dígitos numéricos.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!service) {
        toast.error("Por favor, seleccione un tipo de turno.");
        return;
      }
      toast.success("Tipo de turno seleccionado.", { position: 'top-center' });
      setStep(2);
    } else if (step === 2) {
      if (!date || !time) {
        toast.error("Por favor, seleccione un día y un horario.");
        return;
      }
      toast.success("Horario reservado temporalmente.", { position: 'top-center' });
      setStep(3);
    } else if (step === 3) {
      if (validateForm()) {
        setStep(4);
        toast.success("¡Reserva confirmada exitosamente!", { position: 'top-center' });
      } else {
        toast.error("Por favor, corrija los errores en el formulario.", { position: 'top-center' });
      }
    }
  };

  const handleBack = () => {
    if (step > 1 && step < 4) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3);
    } else if (step === 1) {
      if (onNavigateHome) onNavigateHome();
    }
  };

  const renderStepIndicator = () => {
    if (step === 4) return null;
    return (
      <div className="flex items-center justify-center gap-2 mb-6 px-4">
        <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
        <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
        <div className={`h-2 flex-1 rounded-full ${step >= 3 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
        <div className={`text-xs font-semibold text-indigo-600`}>
          Paso {step} de 3
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1 bg-slate-100 min-h-screen font-sans">
      {/* Header Sticky para Mobile */}
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm p-4 flex items-center justify-between">
        {step !== 4 ? (
          <button 
            onClick={handleBack}
            className="text-slate-600 hover:text-indigo-600 flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="size-5" />
            <span className="text-sm font-medium">{step === 1 ? 'Salir' : 'Atrás'}</span>
          </button>
        ) : (
          <div /> // Espaciador si no hay boton de volver
        )}
        <h1 className="text-base font-semibold text-slate-900 absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
          {step === 1 && "Tipo de Turno"}
          {step === 2 && "Fecha y Hora"}
          {step === 3 && "Tus Datos"}
          {step === 4 && "Confirmación"}
        </h1>
        <div className="size-5" /> {/* Espaciador balance */}
      </div>

      {/* Contenedor centralizado simulando App Mobile on Desktop, full width on Mobile */}
      <div className="flex-1 w-full max-w-md mx-auto bg-white shadow-xl flex flex-col relative sm:my-8 sm:rounded-3xl sm:border overflow-hidden sm:max-h-[850px]">
        <div className="flex-1 overflow-y-auto pb-4">
          <div className="p-6">
            {renderStepIndicator()}

            {/* PASO 1: SELECCION DE SERVICIO */}
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 mb-1">Especialidad o Servicio</h2>
                  <p className="text-sm text-slate-500 mb-4">Seleccione el tipo de turno que necesita.</p>
                  <div className="grid grid-cols-1 gap-3">
                    {MOCKED_SERVICES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setService(s)}
                        className={`
                          py-4 px-4 rounded-2xl border font-medium transition-all text-left flex items-center justify-between
                          ${service === s 
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-md" 
                            : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <BriefcaseMedical className={`size-5 ${service === s ? "text-indigo-200" : "text-indigo-500"}`} />
                          <span className="truncate">{s}</span>
                        </div>
                        {service === s && <CheckCircle2 className="size-5 shrink-0 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PASO 2: SELECCION DE FECHA Y HORA */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-4 items-center">
                  <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
                    <BriefcaseMedical className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-indigo-500 mb-0.5">Servicio elegido</h3>
                    <p className="font-medium text-indigo-900">{service}</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-800 mb-1">Día de la reserva</h2>
                  <p className="text-sm text-slate-500 mb-4">Seleccione la fecha de su preferencia.</p>
                  <div className="bg-slate-50 border rounded-2xl p-2 flex justify-center">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => {
                        setDate(newDate);
                        setTime(""); // reset time when date changes
                      }}
                      disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))}
                      className="rounded-xl w-full flex justify-center"
                    />
                  </div>
                </div>

                {date && (
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 mb-1">Horarios disponibles</h2>
                    <p className="text-sm text-slate-500 mb-4">
                      Turnos para el {format(date, "d 'de' MMMM", { locale: es })}.
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {MOCKED_TIMES.map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setTime(t);
                          }}
                          className={`
                            py-3 px-2 rounded-xl border text-sm font-medium transition-all
                            ${time === t 
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-md scale-[1.02]" 
                              : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50"
                            }
                          `}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    
                    {time && (
                      <div className="mt-8 animate-in slide-in-from-bottom-2 fade-in duration-300">
                         <Button 
                            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md text-base"
                            onClick={handleNextStep}
                         >
                            Continuar al siguiente paso
                         </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* PASO 3: FORMULARIO DE DATOS */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-4 items-center">
                  <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
                    <CalendarDays className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-indigo-900">{service}</h3>
                    <p className="text-sm text-indigo-700">
                      {date ? format(date, "EEEE d 'de' MMMM", { locale: es }) : ""} - {time} hs
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">Ingresá tus datos</h2>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 flex items-center gap-2">
                      <User className="size-4" /> Nombre Completo
                    </Label>
                    <Input 
                      id="name" 
                      placeholder="Ej: Juan Pérez" 
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if(errors.name) setErrors({...errors, name: "" });
                      }}
                      className={`h-12 rounded-xl ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {errors.name && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="size-3"/>{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 flex items-center gap-2">
                      <Mail className="size-4" /> Correo Electrónico
                    </Label>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="ejemplo@correo.com" 
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if(errors.email) setErrors({...errors, email: "" });
                      }}
                      className={`h-12 rounded-xl ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="size-3"/>{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-700 flex items-center gap-2">
                      <Phone className="size-4" /> Teléfono Celular
                    </Label>
                    <Input 
                      id="phone" 
                      type="tel"
                      placeholder="Ej: 1123456789" 
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/\D/g, ''));
                        if(errors.phone) setErrors({...errors, phone: "" });
                      }}
                      className={`h-12 rounded-xl ${errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {errors.phone && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="size-3"/>{errors.phone}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* PASO 4: CONFIRMACIÓN */}
            {step === 4 && (
              <div className="flex flex-col items-center text-center space-y-6 py-12 animate-in zoom-in-95 duration-500">
                <div className="size-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="size-12 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Reserva exitosa!</h2>
                  <p className="text-slate-600 max-w-[280px] mx-auto leading-relaxed">
                    Hemos enviado los detalles de tu turno al correo proporcionado y al profesional.
                  </p>
                </div>

                <div className="w-full bg-slate-50 border rounded-2xl p-5 text-left space-y-4">
                  <h3 className="font-semibold text-slate-800 border-b pb-2">Detalle de tu reserva</h3>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <BriefcaseMedical className="size-5 text-indigo-500" />
                    <span>{service}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <CalendarDays className="size-5 text-indigo-500" />
                    <span>{date ? format(date, "EEEE d 'de' MMMM, yyyy", { locale: es }) : ""}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Clock className="size-5 text-indigo-500" />
                    <span>{time} hs</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <User className="size-5 text-indigo-500" />
                    <span>{name}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions sticky at the bottom */}
        {step !== 4 && (
          <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] pt-3">
            <Button 
              className="w-full h-14 text-base font-semibold rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200 transition-all"
              onClick={handleNextStep}
              disabled={(step === 1 && !service) || (step === 2 && (!date || !time))}
            >
              {step === 3 ? 'Confirmar Reserva' : 'Continuar'}
            </Button>
            {step === 1 && (
              <p className="text-xs text-center text-slate-500 mt-3">
                No se cobrará ningún cargo por reservar.
              </p>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="p-4 bg-white border-t border-slate-100">
            <Button 
              variant="outline"
              className="w-full h-14 text-base font-semibold rounded-2xl border-slate-300 text-slate-700 hover:bg-slate-50"
              onClick={() => {
                if(onNavigateHome) onNavigateHome();
              }}
            >
              Volver al Inicio
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
