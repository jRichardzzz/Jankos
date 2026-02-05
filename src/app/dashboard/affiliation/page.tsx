'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { 
  Share2, 
  Copy, 
  Check, 
  Users, 
  TrendingUp
} from 'lucide-react';

interface AffiliateData {
  code: string;
  commission_rate: number;
  total_earnings: number;
  total_referrals: number;
}

interface Referral {
  id: string;
  created_at: string;
  profiles: {
    email: string;
    full_name: string;
  };
}

interface Earning {
  id: string;
  amount: number;
  original_amount: number;
  status: string;
  created_at: string;
}

export default function AffiliationPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [affiliateData, setAffiliateData] = useState<AffiliateData | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const generateAffiliateCodeAuto = useCallback(async () => {
    if (!user) return null;
    
    // Générer un code unique basé sur l'email
    const baseCode = user.email?.split('@')[0].toUpperCase().slice(0, 6) || 'USER';
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const code = `${baseCode}${randomSuffix}`;

    const { data, error } = await supabase
      .from('affiliate_codes')
      .insert({
        user_id: user.id,
        code,
        commission_rate: 30,
        total_earnings: 0,
        total_referrals: 0,
      })
      .select()
      .single();

    if (!error && data) {
      return data;
    }
    return null;
  }, [user, supabase]);

  const fetchAffiliateData = useCallback(async () => {
    if (!user) return;

    // Récupérer le code d'affiliation
    let { data: affiliate } = await supabase
      .from('affiliate_codes')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Si pas de code, en créer un automatiquement
    if (!affiliate) {
      affiliate = await generateAffiliateCodeAuto();
    }

    if (affiliate) {
      setAffiliateData(affiliate);

      // Récupérer les filleuls
      const { data: refs } = await supabase
        .from('referrals')
        .select(`
          id,
          created_at,
          profiles:referred_id(email, full_name)
        `)
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      // Transformer les données pour correspondre au type
      const formattedRefs = (refs || []).map((r: { id: string; created_at: string; profiles: { email: string; full_name: string } | { email: string; full_name: string }[] }) => ({
        id: r.id,
        created_at: r.created_at,
        profiles: Array.isArray(r.profiles) ? r.profiles[0] : r.profiles,
      }));
      setReferrals(formattedRefs);

      // Récupérer les gains
      const { data: earns } = await supabase
        .from('affiliate_earnings')
        .select('*')
        .eq('affiliate_id', user.id)
        .order('created_at', { ascending: false });

      setEarnings(earns || []);
    }

    setLoading(false);
  }, [user, supabase, generateAffiliateCodeAuto]);

  useEffect(() => {
    if (user) {
      fetchAffiliateData();
    }
  }, [user, fetchAffiliateData]);

  const copyLink = () => {
    if (!affiliateData) return;
    const link = `https://jankos.cc/?ref=${affiliateData.code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const affiliateLink = affiliateData 
    ? `https://jankos.cc/?ref=${affiliateData.code}` 
    : '';

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto overflow-x-hidden">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Programme d&apos;affiliation</h1>
        <p className="text-sm md:text-base text-gray-500">Gagnez 30% sur chaque vente</p>
      </div>

      {affiliateData && (
        <>
          {/* Stats Cards - Mobile optimized */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
            <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-lg md:rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                </div>
              </div>
              <p className="text-lg md:text-3xl font-bold text-gray-900">
                {affiliateData.total_earnings?.toFixed(0) || '0'}€
              </p>
              <span className="text-xs md:text-sm text-gray-500">Gains</span>
            </div>
            <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg md:rounded-xl flex items-center justify-center">
                  <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-lg md:text-3xl font-bold text-gray-900">
                {affiliateData.total_referrals || 0}
              </p>
              <span className="text-xs md:text-sm text-gray-500">Filleuls</span>
            </div>
            <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-100 rounded-lg md:rounded-xl flex items-center justify-center">
                  <Share2 className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
                </div>
              </div>
              <p className="text-lg md:text-3xl font-bold text-gray-900">
                {affiliateData.commission_rate}%
              </p>
              <span className="text-xs md:text-sm text-gray-500">Commission</span>
            </div>
          </div>

          {/* Affiliate Link - Mobile optimized */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm md:text-base">Votre lien</h3>
            <div className="flex flex-col md:flex-row gap-2 md:gap-3">
              <div className="flex-1 bg-gray-100 rounded-lg md:rounded-xl px-3 py-2 md:px-4 md:py-3 font-mono text-xs md:text-sm text-gray-700 break-all">
                {affiliateLink}
              </div>
              <button
                onClick={copyLink}
                className={`px-4 py-2 md:py-3 rounded-lg md:rounded-xl font-medium flex items-center justify-center gap-2 transition-all text-sm ${
                  copied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-amber-500 text-white hover:bg-amber-600'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copié !' : 'Copier'}
              </button>
            </div>
            <p className="text-xs md:text-sm text-gray-500 mt-2">
              Code : <span className="font-mono font-semibold text-amber-600">{affiliateData.code}</span>
            </p>
          </div>

          {/* Referrals List - Mobile optimized */}
          <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">Vos filleuls</h3>
            </div>
            {referrals.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {referrals.map(ref => (
                  <div key={ref.id} className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                      <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-bold flex-shrink-0">
                        {ref.profiles?.full_name?.[0] || ref.profiles?.email?.[0] || '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{ref.profiles?.full_name || 'Sans nom'}</p>
                        <p className="text-xs text-gray-500 truncate">{ref.profiles?.email}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                      {new Date(ref.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aucun filleul</p>
              </div>
            )}
          </div>

          {/* Earnings History - Mobile optimized */}
          <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">Commissions</h3>
            </div>
            {earnings.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {earnings.map(earn => (
                  <div key={earn.id} className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm">
                        Sur {earn.original_amount.toFixed(0)}€
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(earn.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="font-bold text-green-600 text-sm">+{earn.amount.toFixed(2)}€</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        earn.status === 'paid' 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {earn.status === 'paid' ? 'Payé' : 'Attente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <TrendingUp className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aucune commission</p>
              </div>
            )}
          </div>

          {/* How it works - Mobile optimized */}
          <div className="mt-6 p-4 md:p-6 bg-gray-50 rounded-xl md:rounded-2xl border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm md:text-base">💡 Comment ça marche ?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
              <div className="flex md:flex-col items-center md:items-start gap-3">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                <p className="text-xs md:text-sm text-gray-600">Partagez votre lien</p>
              </div>
              <div className="flex md:flex-col items-center md:items-start gap-3">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                <p className="text-xs md:text-sm text-gray-600">Ils s&apos;inscrivent et achètent</p>
              </div>
              <div className="flex md:flex-col items-center md:items-start gap-3">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                <p className="text-xs md:text-sm text-gray-600">Vous recevez 30%</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
