const Head = ({ keys, headersName }: any) => {
  const tableNames = headersName || {}
  return (
    <thead>
      <tr>
        {keys.map((key: string) => (
          <th key={key}>{tableNames[key] || key}</th>
        ))}
      </tr>
    </thead>
  )
}

const Row = ({ contents }: any) => {
  const headers = Object.keys(contents)
  return (
    <tr key={contents.id}>
      {headers.map((header) => (
        <td key={header}>{contents[header]}</td>
      ))}
    </tr>
  )
}

type TableCustomProps = {
  data: Record<string, string | number | undefined>[]
  headersName?: Record<string, string>
  // onDelete?: (id: string) => void
  // onEdit?: (id: string) => void
  // onClickRow?: (id: string) => void
  // toggleActivation?: (id: string) => void
  // section: string
}

// Pode mostrar ou não o header
// Omitir ou não o id
// Pode mostrar ou não o botão de editar, deletar, ativar/desativar
// pode ter ou não um btn de selecionar
// Função onClickRow
// Pode ter ou não link clicável
export default function TableCustom({ data, headersName }: TableCustomProps) {
  console.log('🚀 ~ file: index.tsx:13 ~ TableCustom ~ data:', data)
  const headers = Object.keys(data[0])
  return (
    <table>
      <Head keys={headers} headersName={headersName} />
      <tbody>
        {data.map((rowData) => (
          <Row contents={rowData} />
        ))}
      </tbody>
    </table>
  )
}
