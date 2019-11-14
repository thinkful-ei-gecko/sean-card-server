const SignServices = {
  getAllSignatures(db) {
    return db('signatures').select('*');
  },
  signCard(db, signature) {
    return db('signatures').insert(signature).returning('*')
      .then(rows => rows[0]);
  }
};

module.exports = SignServices;