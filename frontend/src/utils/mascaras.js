/**
 * Aplica máscara de telefone enquanto o usuário digita.
 * Aceita apenas dígitos e formata como (DD) XXXXX-XXXX (celular, 11 dígitos)
 * ou (DD) XXXX-XXXX (fixo, 10 dígitos). Limita a 11 dígitos no total.
 *
 * @param {string} valor - Valor atual do input (pode conter máscara parcial).
 * @returns {string} Valor formatado.
 */
export function mascararTelefone(valor) {
    const digitos = valor.replace(/\D/g, "").slice(0, 11);

    if (digitos.length === 0) return "";
    if (digitos.length <= 2) return `(${digitos}`;

    const ddd = digitos.slice(0, 2);
    const resto = digitos.slice(2);

    if (resto.length <= 4) {
        return `(${ddd}) ${resto}`;
    }

    if (digitos.length <= 10) {
        // Telefone fixo: (DD) XXXX-XXXX
        const parte1 = resto.slice(0, 4);
        const parte2 = resto.slice(4);
        return `(${ddd}) ${parte1}-${parte2}`;
    }

    // Celular: (DD) XXXXX-XXXX
    const parte1 = resto.slice(0, 5);
    const parte2 = resto.slice(5);
    return `(${ddd}) ${parte1}-${parte2}`;
}

/**
 * Aplica máscara de CEP enquanto o usuário digita: 00000-000.
 * Limita a 8 dígitos no total.
 *
 * @param {string} valor - Valor atual do input (pode conter máscara parcial).
 * @returns {string} Valor formatado.
 */
export function mascararCep(valor) {
    const digitos = valor.replace(/\D/g, "").slice(0, 8);

    if (digitos.length <= 5) return digitos;

    return `${digitos.slice(0, 5)}-${digitos.slice(5)}`;
}
