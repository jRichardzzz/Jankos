import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { memberId } = await req.json();

    if (!memberId) {
      return NextResponse.json({ error: 'ID du membre requis' }, { status: 400 });
    }

    // Vérifier que l'utilisateur est bien le propriétaire de l'équipe
    const { data: teamMember, error: findError } = await supabase
      .from('team_members')
      .select('id')
      .eq('owner_id', user.id)
      .eq('member_id', memberId)
      .single();

    if (findError || !teamMember) {
      return NextResponse.json({ error: 'Membre non trouvé dans votre équipe' }, { status: 404 });
    }

    // Supprimer le membre
    const { error: deleteError } = await supabase
      .from('team_members')
      .delete()
      .eq('owner_id', user.id)
      .eq('member_id', memberId);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Membre retiré avec succès' });

  } catch (error) {
    console.error('Team remove error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
