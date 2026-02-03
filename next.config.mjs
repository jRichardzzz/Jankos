import JavaScriptObfuscator from 'webpack-obfuscator';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Désactiver les source maps en production pour cacher le code
  productionBrowserSourceMaps: false,
  
  // Optimisation des images - CRITICAL pour mobile
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pzeghsvbubphwqphmvrv.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Formats modernes optimisés (Vercel supporte nativement)
    formats: ['image/avif', 'image/webp'],
    // Tailles d'images à générer - optimisées pour mobile
    deviceSizes: [390, 435, 640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 144, 256, 288],
    // Minimiser la qualité pour réduire la taille
    minimumCacheTTL: 31536000, // 1 an de cache
  },
  
  
  webpack: (config, { dev, isServer }) => {
    // Obfuscation uniquement en production et côté client
    if (!dev && !isServer) {
      config.plugins.push(
        new JavaScriptObfuscator({
          // Options d'obfuscation
          rotateStringArray: true,
          stringArray: true,
          stringArrayThreshold: 0.75,
          deadCodeInjection: false, // Désactivé pour ne pas altérer les performances
          debugProtection: false,
          disableConsoleOutput: true, // Désactive les console.log en prod
          identifierNamesGenerator: 'hexadecimal',
          renameGlobals: false,
          selfDefending: false, // Peut casser le code dans certains cas
          splitStrings: true,
          splitStringsChunkLength: 5,
          transformObjectKeys: true,
          unicodeEscapeSequence: false,
        }, [])
      );
    }
    return config;
  },
};

export default nextConfig;
