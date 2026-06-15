function validate(schema, campo = "body") {
    return (req, res, next) => {
        const resultado = schema.safeParse(req[campo]);
        if (!resultado.success) {
            const erros = resultado.error.errors.map((e) => ({
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