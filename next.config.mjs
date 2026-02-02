import JavaScriptObfuscator from 'webpack-obfuscator';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Désactiver les source maps en production pour cacher le code
  productionBrowserSourceMaps: false,
  
  // Autoriser les images depuis Supabase
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pzeghsvbubphwqphmvrv.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
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
