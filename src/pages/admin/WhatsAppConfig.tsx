import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Trash2 } from "lucide-react";

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";

interface QuickMessage {
  text: string;
  message: string;
}

const WhatsAppConfig = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    whatsapp_numero: "",
    whatsapp_titulo: "",
    whatsapp_mensagem_padrao: "",
    whatsapp_saudacao: "",
    whatsapp_instrucao: "",
    whatsapp_horario: "",
  });
  const [quickMessages, setQuickMessages] = useState<QuickMessage[]>([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", SETTINGS_ID)
        .single();

      if (error) throw error;

      if (data) {
        setSettings({
          whatsapp_numero: data.whatsapp_numero || "",
          whatsapp_titulo: data.whatsapp_titulo || "",
          whatsapp_mensagem_padrao: data.whatsapp_mensagem_padrao || "",
          whatsapp_saudacao: data.whatsapp_saudacao || "",
          whatsapp_instrucao: data.whatsapp_instrucao || "",
          whatsapp_horario: data.whatsapp_horario || "",
        });
        setQuickMessages((data.whatsapp_opcoes as unknown as QuickMessage[]) || []);
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      toast.error("Erro ao carregar configurações");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from("site_settings")
        .update({
          ...settings,
          whatsapp_opcoes: quickMessages as any,
          updated_at: new Date().toISOString(),
        })
        .eq("id", SETTINGS_ID);

      if (error) throw error;

      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  const addQuickMessage = () => {
    setQuickMessages([...quickMessages, { text: "", message: "" }]);
  };

  const removeQuickMessage = (index: number) => {
    setQuickMessages(quickMessages.filter((_, i) => i !== index));
  };

  const updateQuickMessage = (index: number, field: keyof QuickMessage, value: string) => {
    const updated = [...quickMessages];
    updated[index][field] = value;
    setQuickMessages(updated);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações WhatsApp</h1>
        <p className="text-muted-foreground">
          Configure o widget de WhatsApp do site
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numero">Número WhatsApp (com DDI)</Label>
            <Input
              id="numero"
              placeholder="5531999999999"
              value={settings.whatsapp_numero}
              onChange={(e) =>
                setSettings({ ...settings, whatsapp_numero: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground">
              Formato: código do país + DDD + número (ex: 5531999999999)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="titulo">Título do Widget</Label>
            <Input
              id="titulo"
              placeholder="Rancho Prado - Atendimento"
              value={settings.whatsapp_titulo}
              onChange={(e) =>
                setSettings({ ...settings, whatsapp_titulo: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mensagem">Mensagem Padrão</Label>
            <Textarea
              id="mensagem"
              placeholder="Olá! Gostaria de saber mais sobre..."
              value={settings.whatsapp_mensagem_padrao}
              onChange={(e) =>
                setSettings({ ...settings, whatsapp_mensagem_padrao: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="saudacao">Saudação</Label>
            <Textarea
              id="saudacao"
              placeholder="👋 Olá! Como podemos ajudar você hoje?"
              value={settings.whatsapp_saudacao}
              onChange={(e) =>
                setSettings({ ...settings, whatsapp_saudacao: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instrucao">Instrução</Label>
            <Input
              id="instrucao"
              placeholder="Escolha uma opção abaixo ou digite sua mensagem:"
              value={settings.whatsapp_instrucao}
              onChange={(e) =>
                setSettings({ ...settings, whatsapp_instrucao: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="horario">Horário de Atendimento</Label>
            <Input
              id="horario"
              placeholder="Seg-Dom: 6h às 22h"
              value={settings.whatsapp_horario}
              onChange={(e) =>
                setSettings({ ...settings, whatsapp_horario: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Mensagens Rápidas</CardTitle>
          <Button onClick={addQuickMessage} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {quickMessages.map((msg, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Label>Opção {index + 1}</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuickMessage(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`text-${index}`}>Texto do Botão</Label>
                <Input
                  id={`text-${index}`}
                  placeholder="Quero fazer uma reserva"
                  value={msg.text}
                  onChange={(e) =>
                    updateQuickMessage(index, "text", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`message-${index}`}>Mensagem Completa</Label>
                <Textarea
                  id={`message-${index}`}
                  placeholder="Olá! Gostaria de fazer uma reserva..."
                  value={msg.message}
                  onChange={(e) =>
                    updateQuickMessage(index, "message", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
          {quickMessages.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma mensagem rápida configurada. Clique em "Adicionar" para criar uma.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default WhatsAppConfig;
