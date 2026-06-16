function validate(schema, campo = "body") {
    if (!schema) {
        throw new Error("[validate] schema não foi fornecido.");
    }
    return (req, res, next) => {
        const resultado = schema.safeParse(req[campo] ?? {});
        if (!resultado.success) {
            // Zod v4: usa .issues em vez de .errors.errors
            const erros = resultado.error.issues.map((e) => ({
                campo: e.path.join(".") || campo,
                mensagem: e.message,
            }));
            return res.status(400).json({
                erro: "Dados inválidos.",
                detalhes: erros,
            });
        }
        req[campo] = resultado.data;
        next();
    };
}

module.exports = { validate };