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
import { useState } from 'react';
import { invalidateCacheByPrefix } from '@/lib/cacheService';

interface RanchoImage {
  url: string;
}

interface Rancho {
  id: string;
  nome: string;
  rancho_imagens: RanchoImage[];
}

interface DeleteRanchoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rancho: Rancho;
  onSuccess: () => void;
}

export const DeleteRanchoDialog = ({
  open,
  onOpenChange,
  rancho,
  onSuccess,
}: DeleteRanchoDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // 1. Delete images from storage
      if (rancho.rancho_imagens && rancho.rancho_imagens.length > 0) {
        const imagePaths = rancho.rancho_imagens.map((img) => {
          const urlParts = img.url.split('/');
          return `${urlParts[urlParts.length - 2]}/${urlParts[urlParts.length - 1]}`;
        });

        const { error: storageError } = await supabase.storage
          .from('ranchos')
          .remove(imagePaths);

        if (storageError) {
          console.error('Error deleting images from storage:', storageError);
        }
      }

      // 2. Delete rancho (images records will be deleted by CASCADE)
      const { error: deleteError } = await supabase
        .from('ranchos')
        .delete()
        .eq('id', rancho.id);

      if (deleteError) throw deleteError;

      invalidateCacheByPrefix('ranchos');
      toast.success('Rancho excluído com sucesso!');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting rancho:', error);
      toast.error('Erro ao excluir rancho');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. O rancho <strong>{rancho.nome}</strong> e{' '}
            <strong>{rancho.rancho_imagens?.length || 0} imagem(ns)</strong> serão
            permanentemente removidos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
