const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
};

environments.production = {
    port: 5000,
    envName: 'production',
};

const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : 'staging';
const environmentToExport = typeof environments[currentEnvironment] === 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;