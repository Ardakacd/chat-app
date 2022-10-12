class BanError extends Error {
  constructor() {
    super("This user is banned!");
    this.statusCode = 403;
  }
}

module.exports = BanError;
