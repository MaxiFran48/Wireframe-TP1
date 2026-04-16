import { useState } from "react";
import M02RF01 from "./components/M02RF01";
import M02RF02 from "./components/M02RF02";
import M02RF03 from "./components/M02RF03";

type View = "home" | "M02-RF01" | "M02-RF02" | "M02-RF03";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("home");

  const renderView = () => {
    switch (currentView) {
      case "M02-RF01":
        return <M02RF01 />;
      case "M02-RF02":
        return <M02RF02 />;
      case "M02-RF03":
        return <M02RF03 />;
      default:
        return null;
    }
  };

  if (currentView !== "home") {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="p-4 border-b bg-white shadow-sm z-10 relative">
          <button 
            onClick={() => setCurrentView("home")}
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 flex items-center gap-2 transition-colors"
          >
            ← Volver al inicio (Perfil de Administrador)
          </button>
        </div>
        {renderView()}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-slate-50 flex flex-col items-center">
      <div className="max-w-5xl w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Perfil de Administrador</h1>
          <p className="text-slate-600">Seleccione la funcionalidad que desea gestionar</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            onClick={() => setCurrentView("M02-RF01")}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-all hover:border-indigo-400 group"
          >
            <div className="text-xs font-semibold text-indigo-600 mb-2">M02-RF01</div>
            <h2 className="text-xl font-semibold mb-2 text-slate-900 group-hover:text-indigo-700 transition-colors">Agenda de horarios</h2>
            <p className="text-slate-600 text-sm">Configure sus horas laborales por día y los tipos de turnos disponibles.</p>
          </div>

          <div 
            onClick={() => setCurrentView("M02-RF02")}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-all hover:border-indigo-400 group"
          >
            <div className="text-xs font-semibold text-indigo-600 mb-2">M02-RF02</div>
            <h2 className="text-xl font-semibold mb-2 text-slate-900 group-hover:text-indigo-700 transition-colors">Días bloqueados</h2>
            <p className="text-slate-600 text-sm">Gestione días sin disponibilidad operativa (feriados, licencias).</p>
          </div>

          <div 
            onClick={() => setCurrentView("M02-RF03")}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-all hover:border-indigo-400 group"
          >
            <div className="text-xs font-semibold text-indigo-600 mb-2">M02-RF03</div>
            <h2 className="text-xl font-semibold mb-2 text-slate-900 group-hover:text-indigo-700 transition-colors">Preferencias</h2>
            <p className="text-slate-600 text-sm">Establezca descansos, antelación mínima de reservas y máximo de turnos por día.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
