"use client";

import { useState } from "react";
import { Clock, Sliders, Palette, AlertCircle } from "lucide-react";
import { useAuth } from "~/features/auth/queries/use-auth";
import { useSettingsForms } from "./hooks/use-settings-forms";
import { ExpedienteTab } from "./components/expediente-tab";
import { ServicosTab } from "./components/servicos-tab";
import { VisualTab } from "./components/visual-tab";
import { LivePreview } from "./components/live-preview";
import { SettingsSkeleton } from "./components/settings-skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { type SettingsTab } from "./types";

const tabsTriggerClass = "cursor-pointer font-semibold text-sm px-4 py-3 rounded-none border-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary dark:data-[state=active]:bg-transparent text-muted-foreground hover:text-foreground";

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("expediente");

  const { expedienteForm, servicosForm, visualForm, errorMsg } =
    useSettingsForms();

  if (authLoading) {
    return <SettingsSkeleton />;
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center flex flex-col gap-4 animate-in fade-in duration-300">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" aria-hidden="true" />
        <h2 className="text-2xl font-bold">Acesso restrito</h2>
        <p className="text-muted-foreground">Por favor, realize o login para acessar as configurações.</p>
      </div>
    );
  }

  const watchedBrandColor = visualForm.form.watch("brandColor") || "#7c3aed";
  const watchedBrandLogo = visualForm.form.watch("brandLogo") || "";

  return (
    <div className="flex flex-col gap-8 p-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-extrabold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground font-medium">
          Gerencie seu expediente de trabalho, catálogo de serviços e personalize visualmente sua página pública.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as SettingsTab)}
        className="w-full flex flex-col gap-6"
      >
        <TabsList
          variant="line"
          className="w-full pb-px justify-start h-auto p-0 bg-transparent rounded-none gap-6"
        >
          <TabsTrigger
            value="expediente"
            className={tabsTriggerClass}
          >
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>Expediente de Trabalho</span>
          </TabsTrigger>
          <TabsTrigger
            value="servicos"
            className={tabsTriggerClass}
          >
            <Sliders className="h-4 w-4" aria-hidden="true" />
            <span>Catálogo de Serviços</span>
          </TabsTrigger>
          <TabsTrigger
            value="visual"
            className={tabsTriggerClass}
          >
            <Palette className="h-4 w-4" aria-hidden="true" />
            <span>Personalização Visual</span>
          </TabsTrigger>
        </TabsList>

        {errorMsg && (
          <Alert variant="destructive" role="alert" className="animate-in fade-in duration-200">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        <TabsContent value="expediente" className="focus-visible:outline-none">
          <ExpedienteTab expedienteForm={expedienteForm} />
        </TabsContent>

        <TabsContent value="servicos" className="focus-visible:outline-none">
          <ServicosTab servicosForm={servicosForm} />
        </TabsContent>

        <TabsContent value="visual" className="focus-visible:outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <VisualTab visualForm={visualForm} />
            </div>
            <LivePreview
              brandColor={watchedBrandColor}
              brandLogo={watchedBrandLogo}
              user={user}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
