const geoip = require('geoip-lite');

module.exports = function () {
  const getIpInfo = function (ip, navigator) {
    // IPV6 addresses can include IPV4 addresses
    // So req.ip can be '::ffff:86.3.182.58'
    // However geoip-lite returns null for these
    if (ip.includes('::ffff:')) {
      ip = ip.split(':').reverse()[0];
    }

    if (ip === '127.0.0.1') {
      return { ip, navigator };
    }
    const lookedUpIP = geoip.lookup(ip);
    if (!lookedUpIP) {
      return { ip, navigator };
    }
    return { ip, location: lookedUpIP, navigator };
  };

  const getIpInfoMiddleware = function (req, res, next) {
    const xForwardedFor = (req.headers['x-forwarded-for'] || '').replace(/:\d+$/, '');
    const ip = xForwardedFor || req.connection.remoteAddress;
    req.ipInfo = getIpInfo(ip, req.get('user-agent'));
    next();
  };

  return {
    getIpInfoMiddleware,
    getIpInfo
  };
};
