export type AnalyzesDataList = {
  id: string
  title: string
  bucketUrl: string
  biUrl?: string
  status: string
}

type ListItemProps = {
  data: AnalyzesDataList
}

export default function ListAnalyzesItem({ data }: ListItemProps) {
  return (
    <div className="flex md:gap10 hover:bg-slate-100 bg-white hover:cursor-pointer w-full border rounded max-h-18">
      <div className="flex justify-evenly">
        <div className="px-4 py-4 flex gap-6 justify-evenly">
          {/* TODO: Colocar logica para trocar de cor confirme status e habilitar o click apenas se estiver done */}
          <button
            disabled={!data.biUrl}
            className={`flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 ${
              !data.biUrl ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <a target="_blank" href={data.biUrl} rel="noreferrer">
              {data.status}
            </a>
          </button>
        </div>
        <div className="px-4 py-4 text-sm font-medium items-center w-40 md:w-80 hidden sm:flex justify-start ">
          <h2 className="font-medium text-gray-800 dark:text-white ">
            {data.title}
          </h2>
        </div>
        <div className="px-4 py-4 text-sm whitespace-nowrap">
          {/* TODO: Colocar tamanho maximo para não quebrar a visualização */}
          <div className="flex items-center flex-col">
            <a target="_blank" href={data.bucketUrl} rel="noreferrer">
              {data.bucketUrl}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
