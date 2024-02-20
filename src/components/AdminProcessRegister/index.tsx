import Link from 'next/link'
import { useState } from 'react'

import { Download } from '@mui/icons-material'
import { Box, Button } from '@mui/material'
import { eProcessStatus } from 'interfaces/entities/process/EProcessStatus'
import useMainStore from 'store/useMainStore'

type AdminProcessRegisterProps = {
  process: any
  closeModal: () => void
  isSystemAdmin: boolean
}

export default function AdminProcessRegister({
  process,
  closeModal,
  isSystemAdmin
}: AdminProcessRegisterProps) {
  const [processDone, processReject, processUpdate] = useMainStore((state) => [
    state.processDone,
    state.processReject,
    state.processUpdate
  ])

  const [comments, setComments] = useState(process?.message || '')
  const [status, setStatus] = useState<string | null>(null)

  function fileAdapter(file: any) {
    const fileKey = file.key
    const fileKeyItems = fileKey.split('.')
    const name = fileKeyItems[1]
    const type = fileKeyItems[fileKeyItems.length - 1]

    return { id: file.documentId, name, type }
  }

  const handleSubmit = async () => {
    if (status === eProcessStatus.done) {
      processDone(process.id, { message: comments })
    } else if (status === eProcessStatus.rejected) {
      processReject(process.id, comments)
    } else {
      processUpdate(process.id, { message: comments, status })
    }

    closeModal()
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box mt={2} mb={2} sx={{ minWidth: 300 }}>
        <label htmlFor="documents" className="text-left">
          Documentos:
        </label>

        <ul className="w-full  mt-2 h-[100px] border p-4 overflow-auto overflow-x-hidden">
          {process.documents
            .map((el: any) => {
              return fileAdapter(el)
            })
            .map((el: any, idx: any) => {
              return (
                <Link
                  href={process.documents[idx].url}
                  key={idx}
                  target="_blank"
                >
                  <li
                    key={idx}
                    className="w-full flex items-center justify-between hover:bg-slate-100"
                  >
                    <Download sx={{ fontSize: 13, color: 'green' }} />
                    <div className="hover:underline text-[13px] w-full ml-2 truncate">
                      {el.name}
                    </div>
                  </li>
                </Link>
              )
            })}
        </ul>
      </Box>

      <div className="flex flex-col items-start w-full">
        <label htmlFor="message" className="text-left">
          Mensagem:
        </label>
        <textarea
          id="message"
          value={comments}
          className="my-2 rounded-md drop-shadow-md w-full h-24 "
          onChange={(e) => setComments(e.target.value)}
          disabled={!isSystemAdmin}
        />
      </div>
      {isSystemAdmin && (
        <div className="py-1 mt-4 mb-2 w-full flex gap-4 items-baseline justify-center">
          <select
            className="mb-2 py-3 rounded-md"
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value={eProcessStatus.open}>Selecione...</option>
            <option value={eProcessStatus.pending}>Em andamento</option>
            <option value={eProcessStatus.rejected}>Solicitar correção</option>
            <option value={eProcessStatus.done}>Finalizar</option>
          </select>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!status}
            size="large"
          >
            Salvar
          </Button>
        </div>
      )}
    </Box>
  )
}
