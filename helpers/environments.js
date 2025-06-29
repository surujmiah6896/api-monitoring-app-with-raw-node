const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'fsdfdsfsdfdsf',
};

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'xvcxvdfdsf',
};

const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';
const environmentToExport = typeof environments[currentEnvironment] === 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;