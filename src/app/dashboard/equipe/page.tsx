'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Users, UserPlus, Crown, Trash2, Mail, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface TeamMember {
  id: string;
  email: string;
  full_name: string | null;
  role: 'owner' | 'member';
  joined_at: string;
  avatar_url?: string;
}

interface SubscriptionInfo {
  plan_id: string;
  status: string;
  max_seats: number;
}

export default function EquipePage() {
  const { user } = useAuth();
  const supabase = createClient();
  
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEligible, setIsEligible] = useState(false);

  // Vérifier l'éligibilité et charger les données
  useEffect(() => {
    async function loadTeamData() {
      if (!user) return;

      try {
        // Vérifier le statut d'abonnement
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_status, subscription_plan')
          .eq('id', user.id)
          .single();

        // Seuls les abonnés Pro (sub_5000) et Volume+ (sub_10000) ont accès
        const eligiblePlans = ['sub_5000', 'sub_10000'];
        const planId = profile?.subscription_plan || '';
        const isActive = profile?.subscription_status === 'active';
        
        if (isActive && eligiblePlans.includes(planId)) {
          setIsEligible(true);
          
          // Définir les sièges max selon le plan
          const maxSeats = planId === 'sub_10000' ? 5 : 3;
          setSubscription({
            plan_id: planId,
            status: 'active',
            max_seats: maxSeats
          });

          // Charger les membres de l'équipe
          const { data: teamData } = await supabase
            .from('team_members')
            .select(`
              id,
              role,
              joined_at,
              member:profiles!team_members_member_id_fkey(
                id,
                email,
                full_name,
                avatar_url
              )
            `)
            .eq('owner_id', user.id);

          if (teamData && teamData.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mappedMembers = teamData.map((tm: any) => {
              const memberData = Array.isArray(tm.member) ? tm.member[0] : tm.member;
              return {
                id: memberData?.id || '',
                email: memberData?.email || '',
                full_name: memberData?.full_name || null,
                role: 'member' as const,
                joined_at: tm.joined_at,
                avatar_url: memberData?.avatar_url
              };
            }).filter((m: TeamMember) => m.id);

            const formattedMembers: TeamMember[] = [
              // Le propriétaire
              {
                id: user.id,
                email: user.email || '',
                full_name: user.user_metadata?.full_name || null,
                role: 'owner',
                joined_at: '',
                avatar_url: user.user_metadata?.avatar_url
              },
              // Les membres
              ...mappedMembers
            ];
            setMembers(formattedMembers);
          } else {
            // Juste le propriétaire
            setMembers([{
              id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || null,
              role: 'owner',
              joined_at: '',
              avatar_url: user.user_metadata?.avatar_url
            }]);
          }
        }
      } catch (err) {
        console.error('Error loading team data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadTeamData();
  }, [user, supabase]);

  // Inviter un membre
  const handleInvite = async () => {
    if (!inviteEmail || !user || !subscription) return;
    
    setInviting(true);
    setError(null);
    setSuccess(null);

    try {
      // Vérifier qu'on n'a pas atteint la limite
      if (members.length >= subscription.max_seats) {
        setError(`Vous avez atteint la limite de ${subscription.max_seats} membres.`);
        return;
      }

      // Vérifier que l'email n'est pas déjà membre
      if (members.some(m => m.email.toLowerCase() === inviteEmail.toLowerCase())) {
        setError('Cette personne fait déjà partie de votre équipe.');
        return;
      }

      const res = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'invitation');
      }

      setSuccess(`Invitation envoyée à ${inviteEmail}`);
      setInviteEmail('');
      
      // Recharger les membres
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setInviting(false);
    }
  };

  // Retirer un membre
  const handleRemove = async (memberId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir retirer ce membre ?')) return;

    try {
      const res = await fetch('/api/team/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de la suppression');
      }

      setMembers(members.filter(m => m.id !== memberId));
      setSuccess('Membre retiré de l\'équipe');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // Si pas éligible
  if (!isEligible) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 p-8 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
            <Users className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Multi-sièges</h2>
          <p className="text-gray-500 mb-6">
            La fonctionnalité multi-sièges est disponible uniquement avec les abonnements 
            <span className="font-semibold text-amber-600"> Pro (5000 crédits/mois)</span> et 
            <span className="font-semibold text-amber-600"> Volume+ (10000 crédits/mois)</span>.
          </p>
          <div className="flex flex-col gap-3">
            <div className="p-4 bg-amber-50 rounded-xl">
              <p className="font-semibold text-amber-800">Pro - 5000 crédits/mois</p>
              <p className="text-sm text-amber-600">Jusqu&apos;à 3 membres d&apos;équipe</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <p className="font-semibold text-amber-800">Volume+ - 10000 crédits/mois</p>
              <p className="text-sm text-amber-600">Jusqu&apos;à 5 membres d&apos;équipe</p>
            </div>
          </div>
          <a 
            href="/dashboard/credits"
            className="inline-block mt-6 px-6 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors"
          >
            Voir les abonnements
          </a>
        </motion.div>
      </div>
    );
  }

  const remainingSeats = subscription ? subscription.max_seats - members.length : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900">Mon Équipe</h1>
        <p className="text-gray-500">Gérez les membres de votre équipe et partagez vos crédits</p>
      </motion.div>

      {/* Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </motion.div>
      )}
      
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700"
        >
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          {success}
        </motion.div>
      )}

      {/* Infos abonnement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 mb-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Votre abonnement</p>
            <p className="text-2xl font-bold">
              {subscription?.plan_id === 'sub_10000' ? 'Volume+' : 'Pro'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-sm">Sièges utilisés</p>
            <p className="text-2xl font-bold">
              {members.length} / {subscription?.max_seats}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Formulaire d'invitation */}
      {remainingSeats > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 mb-6"
        >
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-amber-500" />
            Inviter un membre
          </h3>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="email@exemple.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              onClick={handleInvite}
              disabled={!inviteEmail || inviting}
              className="px-6 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {inviting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              Inviter
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Il reste {remainingSeats} place{remainingSeats > 1 ? 's' : ''} disponible{remainingSeats > 1 ? 's' : ''}
          </p>
        </motion.div>
      )}

      {/* Liste des membres */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            Membres de l&apos;équipe ({members.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {members.map((member) => (
            <div key={member.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  {member.avatar_url ? (
                    <img 
                      src={member.avatar_url} 
                      alt={member.full_name || member.email}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                      {(member.full_name?.[0] || member.email[0]).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">
                      {member.full_name || member.email.split('@')[0]}
                    </p>
                    {member.role === 'owner' && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Propriétaire
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
              </div>
              {member.role !== 'owner' && (
                <button
                  onClick={() => handleRemove(member.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Note explicative */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 p-4 bg-blue-50 rounded-xl text-sm text-blue-700"
      >
        <p className="font-medium mb-1">Comment ça marche ?</p>
        <ul className="list-disc list-inside space-y-1 text-blue-600">
          <li>Les membres de votre équipe partagent vos crédits</li>
          <li>Chaque génération est décomptée de votre solde</li>
          <li>Vous pouvez retirer un membre à tout moment</li>
        </ul>
      </motion.div>
    </div>
  );
}
