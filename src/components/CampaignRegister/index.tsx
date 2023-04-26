import { useContext, useState } from 'react'
import { CampaignsContext } from '../../../context'
import { PhotoIcon } from '@heroicons/react/24/solid'

export default function CampaignRegister() {
  const { state, setState } = useContext(CampaignsContext)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  function handleChange(value: string, state: string) {
    if (state === 'title') setTitle(value)
    if (state === 'description') setDescription(value)
  }

  function handleSave() {
    console.log({ hi: 'hiiiiiiii' })
    const newItem = {
      elementId: (Math.random() * 100).toFixed(1),
      itemTitle: title,
      itemDescription: description
    }

    const nextState = [...state, newItem]
    setState(nextState)
  }

  return (
    <form className="border-grey bg-white p-5 rounded-lg mt-5 mb-5 w-10/12 mx-auto">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-8">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Nova campanha
          </h2>

          <div className="mt-6">
            <div className="">
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Título
              </label>
              <div className="mt-2">
                <input
                  id="title"
                  name="title"
                  type="title"
                  autoComplete="title"
                  value={title}
                  onChange={(e) => handleChange(e.target.value, 'title')}
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset outline-none focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Descrição
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  // type="description"
                  value={description}
                  onChange={(e) => handleChange(e.target.value, 'description')}
                  autoComplete="description"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Imagem de capa
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <PhotoIcon
                    className="mx-auto h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Subir arquivo</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple={true}
                      />
                    </label>
                    <p className="pl-1">ou arrastar</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <a href="/in/campaigns">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancelar
          </button>
        </a>
        <button
          type="button"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handleSave}
        >
          Salvar
        </button>
      </div>
    </form>
  )
}
