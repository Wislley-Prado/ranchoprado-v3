import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { PacoteForm } from '@/components/admin/pacote/PacoteForm';
import { supabase } from '@/integrations/supabase/client';
import { invalidateCacheByPrefix } from '@/lib/cacheService';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const PacoteEditar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: pacote, isLoading, error } = useQuery({
    queryKey: ['pacote', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pacotes')
        .select('*, pacote_imagens(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleSuccess = () => {
    invalidateCacheByPrefix('pacotes');
    queryClient.invalidateQueries({ queryKey: ['admin-pacotes'] });
    queryClient.invalidateQueries({ queryKey: ['pacotes'] });
    queryClient.invalidateQueries({ queryKey: ['pacote', id] });
    navigate('/admin/pacotes');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !pacote) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground mb-4">
          Pacote não encontrado
        </p>
        <Button onClick={() => navigate('/admin/pacotes')}>
          Voltar para Pacotes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/pacotes')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/pacotes">Pacotes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Editar Pacote</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold text-foreground mt-2">
            Editar: {pacote.nome}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Pacote</CardTitle>
          <CardDescription>
            Atualize os dados do pacote de pescaria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PacoteForm pacote={pacote} onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PacoteEditar;
