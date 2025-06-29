const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'thisIsSecretKey',
};

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'thisIsAlsoSecretKey',
};

const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : 'staging';
const environmentToExport = typeof environments[currentEnvironment] === 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;