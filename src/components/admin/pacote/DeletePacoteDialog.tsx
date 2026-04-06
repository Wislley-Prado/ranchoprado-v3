import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { invalidateCacheByPrefix } from '@/lib/cacheService';

interface DeletePacoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pacote: any;
  onSuccess: () => void;
}

export const DeletePacoteDialog = ({
  open,
  onOpenChange,
  pacote,
  onSuccess,
}: DeletePacoteDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!pacote) return;

    setIsDeleting(true);

    try {
      // Excluir imagens do storage
      if (pacote.pacote_imagens && pacote.pacote_imagens.length > 0) {
        const filePaths = pacote.pacote_imagens
          .map((img: any) => {
            const url = new URL(img.url);
            return url.pathname.split('/').slice(-2).join('/');
          })
          .filter(Boolean);

        if (filePaths.length > 0) {
          const { error: storageError } = await supabase.storage
            .from('pacotes')
            .remove(filePaths);

          if (storageError) {
            console.error('Error deleting images:', storageError);
          }
        }
      }

      // Excluir registros de imagens do banco
      const { error: imagesError } = await supabase
        .from('pacote_imagens')
        .delete()
        .eq('pacote_id', pacote.id);

      if (imagesError) throw imagesError;

      // Excluir pacote
      const { error: pacoteError } = await supabase
        .from('pacotes')
        .delete()
        .eq('id', pacote.id);

      if (pacoteError) throw pacoteError;

      invalidateCacheByPrefix('pacotes');
      queryClient.invalidateQueries({ queryKey: ['admin-pacotes'] });
      queryClient.invalidateQueries({ queryKey: ['pacotes'] });
      toast.success('Pacote excluído com sucesso!');
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error deleting pacote:', error);
      toast.error(error.message || 'Erro ao excluir pacote');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o pacote "{pacote?.nome}"?
            <br />
            <br />
            Esta ação não pode ser desfeita. Todas as imagens associadas também serão excluídas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
