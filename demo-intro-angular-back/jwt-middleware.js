const jwt = require("jsonwebtoken");

function jwtInterceptor(req, res, next) {
  // le token est envoyé dans le header Authorization
  const token = req.headers["authorization"];

  // si pas de token, on refuse l'accès
  if (!token) {
    return res.status(401).send();
  }

  jwt.verify(token, "mon-super-secret", (erreur, decoded) => {
    if (erreur) {
      // token invalide ou expiré
      return res.status(401).send();
    }

    // on peut stocker les infos décodées du token pour les routes suivantes
    req.user = decoded;

    // le token est valide, on laisse passer la requête
    next();
  });
}

module.exports = jwtInterceptor;