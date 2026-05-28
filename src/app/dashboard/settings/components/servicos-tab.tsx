import {
  Clock,
  Plus,
  Trash2,
  Save,
  Loader2,
  DollarSign,
  Pencil,
  X,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ServicosFormType } from "../hooks/use-servicos-form";

interface ServicosTabProps {
  servicosForm: ServicosFormType;
}

export function ServicosTab({ servicosForm }: ServicosTabProps) {
  const {
    form,
    handleSubmit,
    services,
    loadingServices,
    editingService,
    handleStartEdit,
    handleCancelEdit,
    handlePriceBlur,
    handleDeleteService,
    errorMsg,
    creatingService,
    deletingServiceId,
  } = servicosForm;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Formulário de Cadastro / Edição */}
      <div className="lg:col-span-5">
        <Card className="border shadow-sm sticky top-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {editingService ? "Editar Serviço" : "Novo Serviço"}
            </CardTitle>
            <CardDescription>
              {editingService
                ? `Modifique os dados do serviço "${editingService.name}".`
                : "Cadastre as opções que seus clientes poderão agendar."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Nome do Serviço */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Nome do Serviço *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Corte de Cabelo"
                          {...field}
                          required
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-semibold" />
                    </FormItem>
                  )}
                />

                {/* Descrição */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Descrição (Opcional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Lavagem e finalização inclusas"
                          {...field}
                          value={field.value || ""}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-semibold" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  {/* Preço */}
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Preço (R$) (Opcional)</FormLabel>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0,00"
                              {...field}
                              value={field.value || ""}
                              onBlur={handlePriceBlur}
                              className="pl-9 h-11"
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="text-xs font-semibold" />
                      </FormItem>
                    )}
                  />

                  {/* Duração */}
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Duração *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full h-11 rounded-xl bg-background border border-input px-3 py-2 text-sm justify-between flex items-center">
                              <SelectValue placeholder="Selecione a duração" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="15">15 minutos</SelectItem>
                            <SelectItem value="30">30 minutos</SelectItem>
                            <SelectItem value="45">45 minutos</SelectItem>
                            <SelectItem value="60">1 hora</SelectItem>
                            <SelectItem value="90">1 hora e 30 min</SelectItem>
                            <SelectItem value="120">2 horas</SelectItem>
                            <SelectItem value="180">3 horas</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs font-semibold" />
                      </FormItem>
                    )}
                  />
                </div>

                {errorMsg && (
                  <div className="p-3 bg-destructive/15 text-destructive rounded-xl text-xs font-semibold">
                    {errorMsg}
                  </div>
                )}

                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    type="submit"
                    disabled={creatingService}
                    className="w-full h-11 font-bold cursor-pointer flex items-center justify-center gap-2"
                  >
                    {creatingService ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : editingService ? (
                      <Save className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    <span>
                      {editingService
                        ? "Salvar Alterações"
                        : "Cadastrar Serviço"}
                    </span>
                  </Button>

                  {editingService && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                      className="w-full h-11 font-bold cursor-pointer flex items-center justify-center gap-2 border-border"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancelar Edição</span>
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Listagem de Serviços */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <h2 className="text-2xl font-bold">
          Serviços Cadastrados ({services.length})
        </h2>

        {loadingServices ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-24 bg-accent/30 rounded-2xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {services.map((srv) => (
              <Card
                key={srv.id}
                className="border shadow-sm hover:shadow-md transition-all duration-200"
              >
                <CardContent className="p-5 flex justify-between items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-lg text-foreground">
                      {srv.name}
                    </h3>
                    {srv.description && (
                      <p className="text-sm text-muted-foreground">
                        {srv.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-muted-foreground mt-2">
                      <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold">
                        <Clock className="h-3 w-3 mr-1" />
                        {srv.duration >= 60
                          ? `${Math.floor(srv.duration / 60)}h${srv.duration % 60 > 0 ? ` ${srv.duration % 60}m` : ""}`
                          : `${srv.duration} min`}
                      </span>
                      {srv.price !== null && srv.price !== undefined && (
                        <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-0.5 rounded-full font-bold">
                          R${" "}
                          {srv.price.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleStartEdit(srv)}
                      className="cursor-pointer border-border hover:bg-accent text-foreground h-9 w-9 rounded-xl flex items-center justify-center"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="destructive"
                      size="icon"
                      disabled={deletingServiceId === srv.id}
                      onClick={() => handleDeleteService(srv.id)}
                      className="cursor-pointer bg-destructive hover:bg-destructive/90 text-destructive-foreground h-9 w-9 rounded-xl flex items-center justify-center"
                    >
                      {deletingServiceId === srv.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border border-dashed rounded-3xl bg-accent/10">
            <p className="text-muted-foreground font-semibold">
              Nenhum serviço cadastrado ainda. Use o formulário à esquerda para
              começar!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
