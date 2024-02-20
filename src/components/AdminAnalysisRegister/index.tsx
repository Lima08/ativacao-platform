import { useState } from 'react'

import { Box, Button } from '@mui/material'
import useMainStore from 'store/useMainStore'

type AdminAnalysisRegisterProps = {
  analysis: any
  closeModal: () => void
  isSystemAdmin: boolean
}

export default function AdminAnalysisRegister({
  analysis,
  closeModal,
  isSystemAdmin
}: AdminAnalysisRegisterProps) {
  const [done, reject] = useMainStore((state) => [state.done, state.reject])

  const [linkBI, setLinkBI] = useState(analysis?.biUrl || '')
  const [comments, setComments] = useState(analysis?.message || '')
  const [status, setStatus] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (status === 'done') {
      done(analysis.id, { biUrl: linkBI, message: comments })
    }
    if (status === 'reject') {
      reject(analysis.id, comments)
    }

    closeModal()
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Button variant="contained" href={analysis.bucketUrl} size="large">
        Baixar arquivo
      </Button>
      <div className="flex flex-col items-start mb-2 mt-4 w-full">
        <label htmlFor="BIURL" className="text-left">
          Link do BI:
        </label>
        <input
          type="text"
          name=""
          id="BIURL"
          value={linkBI}
          className="py-2 my-2 rounded-md w-full drop-shadow-md"
          onChange={(e) => setLinkBI(e.target.value)}
          disabled={!isSystemAdmin}
        />
      </div>
      <div className="flex flex-col items-start w-full">
        <label htmlFor="message" className="text-left">
          Mensagem:
        </label>
        <textarea
          id="message"
          value={comments}
          className="my-2 rounded-md h-2/4 w-full drop-shadow-md"
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
            <option value="">Selecione...</option>
            <option value="done">Aprovar</option>
            <option value="reject">Rejeitar</option>
          </select>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!status}
            size="large"
          >
            Finalizar
          </Button>
        </div>
      )}
    </Box>
  )
}
