import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { RanchoForm } from '@/components/admin/rancho/RanchoForm';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { invalidateCacheByPrefix } from '@/lib/cacheService';

const RanchoEditar = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: rancho, isLoading } = useQuery({
    queryKey: ['rancho', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ranchos')
        .select(`
          *,
          rancho_imagens!rancho_imagens_rancho_id_fkey(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const handleSuccess = () => {
    toast.success('Rancho atualizado com sucesso!');
    invalidateCacheByPrefix('ranchos');
    queryClient.invalidateQueries({ queryKey: ['rancho', id] });
    queryClient.invalidateQueries({ queryKey: ['ranchos'] });
    queryClient.invalidateQueries({ queryKey: ['admin-ranchos'] });
    navigate('/admin/ranchos');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!rancho) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Rancho não encontrado</p>
        <Button onClick={() => navigate('/admin/ranchos')} className="mt-4">
          Voltar para listagem
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/ranchos')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Editar Rancho</h1>
            <p className="text-muted-foreground mt-1">
              Atualize as informações do rancho
            </p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <a href={`/#rancho-${rancho.slug}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            Visualizar no site
          </a>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Rancho</CardTitle>
          <CardDescription>
            Edite os campos desejados e salve as alterações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RanchoForm rancho={rancho} onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
};

export default RanchoEditar;
