"use client";

import Link from "next/link";

export default function Confidentialite() {
  return (
    <div className="min-h-screen bg-[hsl(224,71%,4%)] text-white">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(224,71%,4%)]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-amber-500/30 flex items-center justify-center">
              <span className="text-amber-500 font-bold">J</span>
            </div>
            <span className="font-bold text-white">JANKOS<span className="text-amber-500">.cc</span></span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">Politique de Confidentialité</h1>
          
          <div className="prose prose-invert prose-gray max-w-none space-y-8">
            <p className="text-gray-400 leading-relaxed">
              La présente politique de confidentialité a pour objectif d&apos;informer les utilisateurs du site Jankos.cc de la manière dont leurs données personnelles sont collectées, utilisées et protégées.
            </p>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Responsable du traitement</h2>
              <div className="bg-white/5 rounded-xl p-6 space-y-3">
                <p><strong className="text-white">Site :</strong> <span className="text-gray-300">Jankos.cc</span></p>
                <p><strong className="text-white">Propriétaire :</strong> <span className="text-gray-300">Jordan Richard DELAUNAY</span></p>
                <p><strong className="text-white">Email :</strong> <span className="text-amber-400">contact@jankos.cc</span></p>
                <p><strong className="text-white">URL :</strong> <span className="text-gray-300">https://jankos.cc</span></p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Données collectées</h2>
              <p className="text-gray-400 mb-4">Les données personnelles susceptibles d&apos;être collectées sont :</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Informations de paiement (via prestataire sécurisé Stripe, non stockées sur le site)</li>
                <li>Données de navigation (cookies, adresse IP, type de navigateur)</li>
                <li>Historique des commandes et générations</li>
                <li>Images et prompts soumis aux agents IA</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Finalité de la collecte</h2>
              <p className="text-gray-400 mb-4">Les données sont collectées pour permettre :</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>La gestion des comptes utilisateurs</li>
                <li>Le traitement des commandes et abonnements</li>
                <li>La fourniture des services (génération de miniatures, idées, SEO)</li>
                <li>L&apos;envoi d&apos;emails informatifs ou commerciaux</li>
                <li>L&apos;amélioration du site et des services</li>
                <li>Le support client</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Base légale du traitement</h2>
              <p className="text-gray-400 mb-4">Le traitement repose sur :</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Le consentement de l&apos;utilisateur</li>
                <li>L&apos;exécution d&apos;un contrat (commande, abonnement)</li>
                <li>Le respect d&apos;obligations légales</li>
                <li>L&apos;intérêt légitime du site (amélioration, sécurité)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Durée de conservation</h2>
              <p className="text-gray-400 mb-4">Les données sont conservées :</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Pendant la durée de la relation commerciale</li>
                <li>Jusqu&apos;à 3 ans après le dernier contact</li>
                <li>Selon les obligations légales applicables (facturation, comptabilité)</li>
                <li>Les images générées sont conservées 15 jours puis supprimées</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Partage des données</h2>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4">
                <p className="text-amber-200 text-sm">⚠️ Les données personnelles ne sont jamais vendues.</p>
              </div>
              <p className="text-gray-400 mb-4">Elles peuvent être partagées uniquement avec :</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Prestataires de paiement (Stripe)</li>
                <li>Services d&apos;authentification (Supabase)</li>
                <li>Outils d&apos;analyse (analytics)</li>
                <li>Hébergeur du site (Vercel)</li>
                <li>Services d&apos;IA pour la génération (OpenAI, etc.)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Sécurité</h2>
              <p className="text-gray-400">
                Jankos.cc met en œuvre toutes les mesures raisonnables pour protéger les données contre l&apos;accès non autorisé, la perte ou la divulgation. Les connexions sont sécurisées par HTTPS et les paiements sont gérés par Stripe, certifié PCI-DSS.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">8. Droits de l&apos;utilisateur</h2>
              <p className="text-gray-400 mb-4">Conformément au RGPD, vous disposez des droits :</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {["D'accès", "De rectification", "D'effacement", "De limitation", "D'opposition", "De portabilité"].map((droit) => (
                  <div key={droit} className="bg-white/5 rounded-lg p-3 text-center">
                    <span className="text-green-400 mr-2">✓</span>
                    <span className="text-gray-300 text-sm">{droit}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-400 mt-4">
                Pour exercer vos droits, contactez : <span className="text-amber-400">contact@jankos.cc</span>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">9. Cookies</h2>
              <p className="text-gray-400 mb-4">Le site utilise des cookies pour :</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Assurer le fonctionnement du site (authentification)</li>
                <li>Mesurer l&apos;audience</li>
                <li>Améliorer l&apos;expérience utilisateur</li>
              </ul>
              <p className="text-gray-400 mt-4">L&apos;utilisateur peut refuser les cookies via son navigateur.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">10. Données des mineurs</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Les services ne sont pas destinés aux enfants de moins de 16 ans sans autorisation parentale.</li>
                <li>Aucune donnée n&apos;est collectée sciemment auprès de mineurs sans consentement.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">11. Modification de la politique</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Jankos.cc se réserve le droit de modifier cette politique à tout moment.</li>
                <li>Les utilisateurs seront informés en cas de modification importante.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">12. Contact</h2>
              <p className="text-gray-400">
                Pour toute question ou demande concernant vos données personnelles :
              </p>
              <div className="bg-white/5 rounded-xl p-6 mt-4">
                <p className="text-amber-400 text-lg">📧 contact@jankos.cc</p>
              </div>
            </section>

            <div className="border-t border-white/10 pt-8 mt-8">
              <p className="text-gray-500 text-sm">Dernière mise à jour : Février 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
