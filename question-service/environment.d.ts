declare global {
    namespace NodeJS {
      interface ProcessEnv {
        ENV : 'DEV' | 'PROD';
        DB_LOCAL_URI: string;
        DB_DOCKER_URI: string;
        PORT: string;
      }
    }
  }
  
export {}
