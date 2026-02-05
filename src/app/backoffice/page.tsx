'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  CreditCard, 
  Users, 
  Sparkles, 
  Share2, 
  LogOut,
  Search,
  Plus,
  Minus,
  ChevronDown,
  Calendar,
  TrendingUp
} from 'lucide-react';

type Tab = 'payments' | 'generations' | 'users' | 'affiliates';

interface Payment {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  description: string;
  stripe_session_id: string;
  created_at: string;
  profiles?: { email: string; full_name: string };
}

interface Generation {
  id: string;
  user_id: string;
  agent: string;
  type: string;
  credits_used: number;
  created_at: string;
  input_data: Record<string, unknown>;
  output_data: Record<string, unknown>;
  profiles?: { email: string; full_name: string };
}

interface User {
  id: string;
  email: string;
  full_name: string;
  credits: number;
  subscription_status: string;
  created_at: string;
  is_admin: boolean;
}

interface Affiliate {
  id: string;
  user_id: string;
  code: string;
  commission_rate: number;
  total_earnings: number;
  total_referrals: number;
  profiles?: { email: string; full_name: string };
  referrals?: { referred_id: string; created_at: string; profiles: { email: string; full_name: string } }[];
}

export default function BackofficePage() {
  const router = useRouter();
  const supabase = createClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('payments');
  
  // Data states
  const [payments, setPayments] = useState<Payment[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  
  // UI states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [creditAmount, setCreditAmount] = useState('');
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [expandedGeneration, setExpandedGeneration] = useState<string | null>(null);

  // Check if user is admin
  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (!profile?.is_admin) {
        router.push('/dashboard');
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    }
    checkAdmin();
  }, [router, supabase]);

  // Fetch data based on active tab
  useEffect(() => {
    if (!isAdmin) return;

    async function fetchData() {
      if (activeTab === 'payments') {
        const { data } = await supabase
          .from('transactions')
          .select('*, profiles(email, full_name)')
          .order('created_at', { ascending: false })
          .limit(100);
        setPayments(data || []);
      } else if (activeTab === 'generations') {
        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
        
        const { data } = await supabase
          .from('generations')
          .select('*, profiles(email, full_name)')
          .gte('created_at', fifteenDaysAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(200);
        setGenerations(data || []);
      } else if (activeTab === 'users') {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        setUsers(data || []);
      } else if (activeTab === 'affiliates') {
        const { data } = await supabase
          .from('affiliate_codes')
          .select(`
            *,
            profiles(email, full_name),
            referrals(
              referred_id,
              created_at,
              profiles:referred_id(email, full_name)
            )
          `)
          .order('total_earnings', { ascending: false });
        setAffiliates(data || []);
      }
    }
    fetchData();
  }, [activeTab, isAdmin, supabase]);

  // Handle credit modification
  const handleCreditChange = async (action: 'add' | 'remove') => {
    if (!selectedUser || !creditAmount) return;
    
    const amount = parseInt(creditAmount);
    if (isNaN(amount) || amount <= 0) return;

    const newCredits = action === 'add' 
      ? selectedUser.credits + amount 
      : Math.max(0, selectedUser.credits - amount);

    const { error } = await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', selectedUser.id);

    if (!error) {
      setUsers(users.map(u => 
        u.id === selectedUser.id ? { ...u, credits: newCredits } : u
      ));
      setShowCreditModal(false);
      setCreditAmount('');
      setSelectedUser(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'payments', label: 'Paiements', icon: CreditCard, count: payments.length },
    { id: 'generations', label: 'Générations', icon: Sparkles, count: generations.length },
    { id: 'users', label: 'Utilisateurs', icon: Users, count: users.length },
    { id: 'affiliates', label: 'Affiliation', icon: Share2, count: affiliates.length },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold">J</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Back Office</h1>
              <p className="text-xs text-gray-500">Administration Jankos</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-black'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-black/20' : 'bg-gray-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div>
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-lg font-semibold">Historique des paiements</h2>
                <p className="text-sm text-gray-500">Tous les achats de crédits et abonnements</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Crédits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {payments.map(payment => (
                      <tr key={payment.id} className="hover:bg-gray-800/30">
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(payment.created_at).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium">{payment.profiles?.full_name || 'N/A'}</p>
                            <p className="text-xs text-gray-500">{payment.profiles?.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            payment.type === 'purchase' 
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {payment.type === 'purchase' ? 'Achat' : payment.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{payment.description}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-amber-500 font-semibold">+{payment.amount}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {payments.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    Aucun paiement pour le moment
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Generations Tab */}
          {activeTab === 'generations' && (
            <div>
              <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Générations récentes</h2>
                  <p className="text-sm text-gray-500">15 derniers jours</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  {generations.length} générations
                </div>
              </div>
              <div className="divide-y divide-gray-800">
                {generations.map(gen => (
                  <div key={gen.id} className="p-4 hover:bg-gray-800/30">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedGeneration(expandedGeneration === gen.id ? null : gen.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          gen.agent === 'alice' ? 'bg-pink-500/20 text-pink-400' :
                          gen.agent === 'douglas' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium capitalize">{gen.agent} - {gen.type}</p>
                          <p className="text-sm text-gray-500">{gen.profiles?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-amber-500 font-medium">-{gen.credits_used} crédits</span>
                        <span className="text-xs text-gray-500">
                          {new Date(gen.created_at).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${
                          expandedGeneration === gen.id ? 'rotate-180' : ''
                        }`} />
                      </div>
                    </div>
                    {expandedGeneration === gen.id && (
                      <div className="mt-4 p-4 bg-gray-800/50 rounded-xl">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-2">Input</p>
                            <pre className="text-xs bg-gray-900 p-3 rounded-lg overflow-auto max-h-40">
                              {JSON.stringify(gen.input_data, null, 2)}
                            </pre>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-2">Output</p>
                            <pre className="text-xs bg-gray-900 p-3 rounded-lg overflow-auto max-h-40">
                              {JSON.stringify(gen.output_data, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {generations.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    Aucune génération ces 15 derniers jours
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Gestion des utilisateurs</h2>
                    <p className="text-sm text-gray-500">Voir et modifier les crédits</p>
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Rechercher par email ou nom..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Inscription</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Abonnement</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Crédits</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-gray-800/30">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-sm font-bold">
                              {user.full_name?.[0] || user.email?.[0] || '?'}
                            </div>
                            <div>
                              <p className="font-medium">{user.full_name || 'Sans nom'}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                            {user.is_admin && (
                              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">Admin</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(user.created_at).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.subscription_status === 'active'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-gray-700 text-gray-400'
                          }`}>
                            {user.subscription_status || 'Aucun'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-amber-500 font-semibold">{user.credits}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowCreditModal(true);
                            }}
                            className="px-3 py-1.5 bg-amber-500/20 text-amber-500 rounded-lg text-sm font-medium hover:bg-amber-500/30 transition-colors"
                          >
                            Modifier
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Affiliates Tab */}
          {activeTab === 'affiliates' && (
            <div>
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-lg font-semibold">Système d&apos;affiliation</h2>
                <p className="text-sm text-gray-500">Qui a ramené qui + commissions</p>
              </div>
              <div className="divide-y divide-gray-800">
                {affiliates.map(affiliate => (
                  <div key={affiliate.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                          <Share2 className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-medium">{affiliate.profiles?.full_name || affiliate.profiles?.email}</p>
                          <p className="text-sm text-gray-500">Code: <span className="text-amber-500 font-mono">{affiliate.code}</span></p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-500">{affiliate.total_earnings?.toFixed(2) || '0.00'}€</p>
                        <p className="text-sm text-gray-500">{affiliate.total_referrals || 0} filleuls</p>
                      </div>
                    </div>
                    {affiliate.referrals && affiliate.referrals.length > 0 && (
                      <div className="mt-4 bg-gray-800/50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-3">Filleuls</p>
                        <div className="space-y-2">
                          {affiliate.referrals.map((ref, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">{ref.profiles?.email || ref.referred_id}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(ref.created_at).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {affiliates.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    Aucun affilié pour le moment
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-4 gap-4 mt-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-gray-500 text-sm">Revenus (mois)</span>
            </div>
            <p className="text-2xl font-bold">
              {payments.reduce((acc, p) => acc + (p.amount || 0), 0)} crédits
            </p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-gray-500 text-sm">Utilisateurs</span>
            </div>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-500" />
              </div>
              <span className="text-gray-500 text-sm">Générations (15j)</span>
            </div>
            <p className="text-2xl font-bold">{generations.length}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <Share2 className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-gray-500 text-sm">Affiliés actifs</span>
            </div>
            <p className="text-2xl font-bold">{affiliates.length}</p>
          </div>
        </div>
      </div>

      {/* Credit Modal */}
      {showCreditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-800">
            <h3 className="text-xl font-bold mb-2">Modifier les crédits</h3>
            <p className="text-gray-500 text-sm mb-6">
              {selectedUser.full_name || selectedUser.email}
            </p>
            
            <div className="bg-gray-800 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Crédits actuels</p>
              <p className="text-3xl font-bold text-amber-500">{selectedUser.credits}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantité</label>
              <input
                type="number"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                placeholder="Ex: 100"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => handleCreditChange('add')}
                className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
              <button
                onClick={() => handleCreditChange('remove')}
                className="flex items-center justify-center gap-2 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                <Minus className="w-4 h-4" />
                Retirer
              </button>
            </div>

            <button
              onClick={() => {
                setShowCreditModal(false);
                setSelectedUser(null);
                setCreditAmount('');
              }}
              className="w-full py-3 text-gray-400 hover:text-white transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
