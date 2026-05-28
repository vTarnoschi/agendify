import {
  Palette,
  CheckCircle,
  Plus,
  Trash2,
  Save,
  Loader2,
  Image as ImageIcon,
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
import { Label } from "~/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { VisualFormType } from "../hooks/use-visual-form";

interface VisualTabProps {
  visualForm: VisualFormType;
}

export function VisualTab({ visualForm }: VisualTabProps) {
  const { form, handleSubmit, handleLogoUpload, errorMsg, loading } =
    visualForm;

  const brandColor = form.watch("brandColor") || "#18181b";
  const brandLogo = form.watch("brandLogo") || "";

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Palette className="h-6 w-6 text-primary" />
          Identidade Visual
        </CardTitle>
        <CardDescription>
          Configure a cor do tema e a logomarca do seu negócio para sua página
          pública.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Seletor de Cores */}
            <FormField
              control={form.control}
              name="brandColor"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3">
                  <FormLabel className="font-semibold text-sm">
                    Cor Temática da Marca
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {[
                          { name: "Agendify Roxo", hex: "#7c3aed" },
                          { name: "Azul Real", hex: "#0284c7" },
                          { name: "Esmeralda", hex: "#10b981" },
                          { name: "Dourado", hex: "#d4af37" },
                          { name: "Rosa Moderno", hex: "#ec4899" },
                          { name: "Vinho", hex: "#be123c" },
                          { name: "Laranja", hex: "#f97316" },
                          { name: "Cinza Noir", hex: "#1f2937" },
                        ].map((color) => (
                          <button
                            key={color.hex}
                            type="button"
                            onClick={() =>
                              form.setValue("brandColor", color.hex, {
                                shouldValidate: true,
                              })
                            }
                            title={color.name}
                            className="h-10 rounded-xl cursor-pointer transition-all duration-200 border-2 relative flex items-center justify-center"
                            style={{
                              backgroundColor: color.hex,
                              borderColor:
                                brandColor === color.hex
                                  ? "#ffffff"
                                  : "transparent",
                              boxShadow:
                                brandColor === color.hex
                                  ? "0 0 0 2px var(--primary)"
                                  : "none",
                            }}
                          >
                            {brandColor === color.hex && (
                              <CheckCircle className="h-4 w-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                            )}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <div className="relative h-10 w-10 rounded-xl overflow-hidden shrink-0">
                          <input
                            type="color"
                            value={brandColor}
                            onChange={(e) =>
                              form.setValue("brandColor", e.target.value, {
                                shouldValidate: true,
                              })
                            }
                            className="absolute inset-0 cursor-pointer h-full w-full border-0 p-0"
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            type="text"
                            placeholder="#7c3aed"
                            {...field}
                            onChange={(e) =>
                              form.setValue("brandColor", e.target.value, {
                                shouldValidate: true,
                              })
                            }
                            className="h-10 uppercase font-mono text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-semibold" />
                </FormItem>
              )}
            />

            {/* Logomarca */}
            <FormField
              control={form.control}
              name="brandLogo"
              render={() => (
                <FormItem className="flex flex-col gap-3 border-t border-border pt-4">
                  <FormLabel className="font-semibold text-sm">
                    Logotipo ou Foto do Negócio
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        {/* Preview da Logo Atual */}
                        <div className="relative h-16 w-16 rounded-full border border-border bg-accent/20 flex items-center justify-center overflow-hidden shrink-0">
                          {brandLogo ? (
                            <picture>
                              <img
                                src={brandLogo}
                                alt="Logo Preview"
                                className="h-full w-full object-cover"
                              />
                            </picture>
                          ) : (
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>

                        <div className="flex-1 flex flex-col gap-2">
                          {/* Botão de Upload do Computador */}
                          <div className="relative">
                            <input
                              type="file"
                              id="logoFile"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                document.getElementById("logoFile")?.click()
                              }
                              className="cursor-pointer h-9 px-4 text-xs font-semibold rounded-xl border border-input hover:bg-accent hover:text-accent-foreground flex items-center gap-2"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              Escolher do Computador
                            </Button>
                          </div>

                          {brandLogo && (
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() =>
                                form.setValue("brandLogo", "", {
                                  shouldValidate: true,
                                })
                              }
                              className="cursor-pointer h-8 px-3 text-[10px] font-bold text-destructive hover:bg-destructive/10 hover:text-destructive flex items-center gap-1.5 w-fit"
                            >
                              <Trash2 className="h-3 w-3" />
                              Remover Imagem
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <Label
                          htmlFor="logoUrl"
                          className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider"
                        >
                          Ou digite uma URL externa
                        </Label>
                        <div className="relative">
                          <ImageIcon className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                          <Input
                            id="logoUrl"
                            type="url"
                            placeholder="https://sua-logo.com/imagem.png"
                            value={
                              brandLogo?.startsWith("data:")
                                ? ""
                                : brandLogo || ""
                            }
                            onChange={(e) =>
                              form.setValue("brandLogo", e.target.value, {
                                shouldValidate: true,
                              })
                            }
                            className="pl-8 h-9 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-semibold" />
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    Selecione uma foto direta de seu computador. Nós faremos a
                    compressão otimizada automaticamente!
                  </p>
                </FormItem>
              )}
            />

            {errorMsg && (
              <div className="p-3 bg-destructive/15 text-destructive rounded-xl text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 font-bold cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>Salvar Identidade Visual</span>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
