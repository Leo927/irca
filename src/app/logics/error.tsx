class IrcaError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'IrcaError';
    }
}