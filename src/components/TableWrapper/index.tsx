import ToggleInput from 'components/ToggleInput'
import CustomButton from 'components/CustomButton'

type TableWrapperProps = {
  data: any[]
  onDelete?: (id: string) => void
  onEdit?: (id: string) => void
  toggleActivation?: (id: string) => void
}
export default function TableWrapper({
  data,
  onDelete,
  onEdit,
  toggleActivation
}: TableWrapperProps) {
  return (
    <section className="w-[90%] container px-4 mx-auto">
      <div className="flex flex-col mt-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                  {data && !data.length && (
                    <tr className="hover:bg-slate-100 bg-white rounded-full">
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <div className="flex items-center flex-col">
                          Nenhuma campanha adicionada.
                        </div>
                      </td>
                    </tr>
                  )}
                  {!!data.length &&
                    data.map(({ id, name, description }: any) => {
                      const imgSource =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
                      const imgAlt = 'Imagem da campanha'
                      return (
                        <tr
                          key={id}
                          className="hover:bg-slate-100 bg-white rounded-full"
                        >
                          <td className="px-4 py-4 text-sm whitespace-nowrap">
                            <div className="flex items-center flex-col">
                              <img
                                className="object-cover w-12 h-12 -mx-1 border-2 border-white rounded-full dark:border-gray-700"
                                src={imgSource}
                                alt={imgAlt}
                              />
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                            <div>
                              <h2 className="font-medium text-gray-800 dark:text-white ">
                                {name}
                              </h2>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm whitespace-nowrap">
                            <div>
                              <h4 className="text-gray-700 dark:text-gray-200">
                                {description}
                              </h4>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm whitespace-nowrap flex items-center justify-evenly">
                            <div className="rounded px-1 py-1 text-gray-500 flex w-[40%] gap-2 flex-grow-[2]">
                              {!!toggleActivation && (
                                <ToggleInput
                                  isActive
                                  toggleActivation={() => toggleActivation(id)}
                                />
                              )}
                              {!!onEdit && (
                                <CustomButton onClick={() => onEdit(id)}>
                                  <p>Editar</p>
                                </CustomButton>
                              )}
                              {!!onDelete && (
                                <CustomButton
                                  onClick={() => onDelete(id)}
                                  variant="danger"
                                >
                                  <p>Deletar</p>
                                </CustomButton>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
