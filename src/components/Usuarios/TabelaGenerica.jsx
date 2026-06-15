export default function TabelaGenerica({ colunas, dados, onEditar, onExcluir }) {
  return (
    <table border="1" cellPadding="8">
      <thead>
        <tr>
          {colunas.map((col, index) => (
            <th key={index}>{col.label}</th>
          ))}
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {dados.map((item) => (
          <tr key={item.id}>
            {colunas.map((col, index) => (
              <td key={index}>{item[col.key]}</td>
            ))}
            <td>
              <button onClick={() => onEditar(item)}>Editar</button>
              <button onClick={() => onExcluir(item.id)}>Excluir</button>
            </td>
          </tr>
        ))}
        {dados.length === 0 && (
          <tr>
            <td colSpan={colunas.length + 1} style={{ textAlign: 'center' }}>
              Nenhum registro encontrado.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
