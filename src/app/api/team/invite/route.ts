import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    // Vérifier que l'utilisateur a un abonnement éligible
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_plan')
      .eq('id', user.id)
      .single();

    const eligiblePlans = ['sub_5000', 'sub_10000'];
    if (!profile || profile.subscription_status !== 'active' || !eligiblePlans.includes(profile.subscription_plan)) {
      return NextResponse.json({ error: 'Abonnement non éligible au multi-sièges' }, { status: 403 });
    }

    // Déterminer le nombre max de sièges
    const maxSeats = profile.subscription_plan === 'sub_10000' ? 5 : 3;

    // Compter les membres actuels
    const { count: memberCount } = await supabase
      .from('team_members')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', user.id);

    // +1 pour le propriétaire
    const totalMembers = (memberCount || 0) + 1;

    if (totalMembers >= maxSeats) {
      return NextResponse.json({ 
        error: `Limite atteinte. Votre abonnement permet ${maxSeats} membres maximum.` 
      }, { status: 400 });
    }

    // Trouver l'utilisateur à inviter
    const { data: invitedUser } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .single();

    if (!invitedUser) {
      return NextResponse.json({ 
        error: 'Cet utilisateur n\'existe pas. Il doit d\'abord créer un compte sur Jankos.cc' 
      }, { status: 404 });
    }

    // Vérifier qu'il n'est pas déjà membre
    const { data: existingMember } = await supabase
      .from('team_members')
      .select('id')
      .eq('owner_id', user.id)
      .eq('member_id', invitedUser.id)
      .single();

    if (existingMember) {
      return NextResponse.json({ error: 'Cette personne fait déjà partie de votre équipe' }, { status: 400 });
    }

    // Vérifier que l'utilisateur n'est pas déjà propriétaire ou membre d'une autre équipe
    const { data: alreadyInTeam } = await supabase
      .from('team_members')
      .select('id')
      .or(`owner_id.eq.${invitedUser.id},member_id.eq.${invitedUser.id}`)
      .limit(1);

    if (alreadyInTeam && alreadyInTeam.length > 0) {
      return NextResponse.json({ 
        error: 'Cette personne fait déjà partie d\'une autre équipe' 
      }, { status: 400 });
    }

    // Ajouter le membre
    const { error: insertError } = await supabase
      .from('team_members')
      .insert({
        owner_id: user.id,
        member_id: invitedUser.id,
        role: 'member',
        joined_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'Erreur lors de l\'ajout du membre' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Membre ajouté avec succès' });

  } catch (error) {
    console.error('Team invite error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
